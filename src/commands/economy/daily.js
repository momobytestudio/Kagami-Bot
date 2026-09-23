const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  name: "daily",
  aliases: ["d"],

  async execute(message) {
    let user = await User.findOne({ userId: message.author.id });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;

    if (user.daily.lastClaim) {
      const elapsed = now - user.daily.lastClaim.getTime();

      if (elapsed < cooldown) {
        const remaining = cooldown - elapsed;
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor(
          (remaining % (60 * 60 * 1000)) / (60 * 1000)
        );

        return message.reply(
          `⏳ You already claimed your daily reward. Try again in **${hours}h ${minutes}m**.`
        );
      }
    }

    const reward = 100000;

    user.wallet += reward;
    user.daily.lastClaim = new Date();
    user.daily.streak += 1;

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🎁 Daily Reward")
      .setDescription(
        `You received **$${reward.toLocaleString()}**!\n\n` +
        `💵 Wallet: **$${user.wallet.toLocaleString()}**\n` +
        `🔥 Streak: **${user.daily.streak}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};