const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

const crimes = [
  {
    name: "Sneak into an Otaku Shop",
    min: 50000,
    max: 150000
  },
  {
    name: "Hack an Arcade Machine",
    min: 75000,
    max: 250000
  },
  {
    name: "Steal a Rare Manga",
    min: 100000,
    max: 350000
  },
  {
    name: "Pull off a Midnight Heist",
    min: 250000,
    max: 750000
  }
];

const cooldown = 2 * 60 * 60 * 1000;

module.exports = {
  name: "crime",
  aliases: ["cr", "heist"],

  async execute(message) {
    let user = await User.findOne({
      userId: message.author.id
    });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    if (!user.crime) {
      user.crime = {
        lastCrime: null
      };
    }

    if (user.crime.lastCrime) {
      const elapsed =
        Date.now() - user.crime.lastCrime.getTime();

      if (elapsed < cooldown) {
        const remaining = cooldown - elapsed;

        const hours = Math.floor(
          remaining / (60 * 60 * 1000)
        );

        const minutes = Math.floor(
          (remaining % (60 * 60 * 1000)) /
            (60 * 1000)
        );

        return message.reply(
          `⏳ You're laying low. Try again in **${hours}h ${minutes}m**.`
        );
      }
    }

    const crime =
      crimes[Math.floor(Math.random() * crimes.length)];

    const success = Math.random() < 0.65;

    user.crime.lastCrime = new Date();

    if (!success) {
      await user.save();

      const embed = new EmbedBuilder()
        .setTitle("🚨 Crime Failed")
        .setDescription(
          `You tried to **${crime.name}**...\n\n` +
          `🚔 You got caught and earned **$0**.`
        )
        .setColor(0x2b2d31)
        .setTimestamp();

      return message.reply({
        embeds: [embed]
      });
    }

    const reward =
      BigInt(crime.min) +
      BigInt(
        Math.floor(
          Math.random() *
            (crime.max - crime.min + 1)
        )
      );

    const wallet = BigInt(user.wallet || "0");
    const newWallet = wallet + reward;

    user.wallet = newWallet.toString();

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("💰 Crime Successful!")
      .setDescription(
        `You successfully completed **${crime.name}**!\n\n` +
        `💰 You earned **$${reward.toLocaleString()}**\n` +
        `💵 Wallet: **$${newWallet.toLocaleString()}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};