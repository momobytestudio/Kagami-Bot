const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

const cooldown = 30 * 1000;

const rewards = [
  { min: 100, max: 1000 },
  { min: 500, max: 5000 },
  { min: 1000, max: 10000 },
  { min: 5000, max: 25000 }
];

module.exports = {
  name: "beg",
  aliases: ["b"],

  async execute(message) {
    let user = await User.findOne({
      userId: message.author.id
    });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    if (!user.beg) {
      user.beg = {
        lastBeg: null
      };
    }

    if (user.beg.lastBeg) {
      const elapsed =
        Date.now() - user.beg.lastBeg.getTime();

      if (elapsed < cooldown) {
        const remaining = cooldown - elapsed;

        const seconds = Math.ceil(
          remaining / 1000
        );

        return message.reply(
          `⏳ Try begging again in **${seconds}s**.`
        );
      }
    }

    const rewardRange =
      rewards[Math.floor(Math.random() * rewards.length)];

    const reward =
      BigInt(rewardRange.min) +
      BigInt(
        Math.floor(
          Math.random() *
            (rewardRange.max - rewardRange.min + 1)
        )
      );

    const wallet = BigInt(user.wallet || "0");
    const newWallet = wallet + reward;

    user.wallet = newWallet.toString();
    user.beg.lastBeg = new Date();

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🥺 Begging")
      .setDescription(
        `You begged someone for money...\n\n` +
        `💰 You received **$${reward.toLocaleString()}**!\n` +
        `💵 Wallet: **$${newWallet.toLocaleString()}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};