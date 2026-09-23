const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

const cooldown = 30 * 1000;

const fish = [
  {
    name: "🐟 Small Fish",
    min: 1000,
    max: 5000
  },
  {
    name: "🐠 Tropical Fish",
    min: 5000,
    max: 15000
  },
  {
    name: "🐡 Pufferfish",
    min: 10000,
    max: 30000
  },
  {
    name: "🦑 Squid",
    min: 20000,
    max: 50000
  },
  {
    name: "🦈 Shark",
    min: 50000,
    max: 150000
  },
  {
    name: "🐋 Rare Whale",
    min: 100000,
    max: 500000
  }
];

module.exports = {
  name: "fish",
  aliases: ["fishing", "catch"],

  async execute(message) {
    let user = await User.findOne({
      userId: message.author.id
    });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    if (!user.fishing) {
      user.fishing = {
        lastFish: null
      };
    }

    if (user.fishing.lastFish) {
      const elapsed =
        Date.now() - user.fishing.lastFish.getTime();

      if (elapsed < cooldown) {
        const remaining = cooldown - elapsed;

        const seconds = Math.ceil(
          remaining / 1000
        );

        return message.reply(
          `⏳ Your fishing rod is still recovering. Try again in **${seconds}s**.`
        );
      }
    }

    const caught =
      fish[Math.floor(Math.random() * fish.length)];

    const reward =
      BigInt(caught.min) +
      BigInt(
        Math.floor(
          Math.random() *
            (caught.max - caught.min + 1)
        )
      );

    const wallet = BigInt(user.wallet || "0");
    const newWallet = wallet + reward;

    user.wallet = newWallet.toString();
    user.fishing.lastFish = new Date();

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🎣 Fishing!")
      .setDescription(
        `You cast your line into the water...\n\n` +
        `🎣 You caught a **${caught.name}**!\n` +
        `💰 Value: **$${reward.toLocaleString()}**\n\n` +
        `💵 Wallet: **$${newWallet.toLocaleString()}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};