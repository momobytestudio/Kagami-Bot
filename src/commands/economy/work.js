const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

const jobs = [
  {
    name: "Manga Shop Clerk",
    min: 25000,
    max: 50000
  },
  {
    name: "Anime Café Worker",
    min: 30000,
    max: 60000
  },
  {
    name: "Lucky Star Cosplayer",
    min: 35000,
    max: 70000
  },
  {
    name: "Game Tester",
    min: 40000,
    max: 80000
  },
  {
    name: "Otaku Shop Manager",
    min: 50000,
    max: 100000
  }
];

const cooldown = 60 * 60 * 1000;

module.exports = {
  name: "work",
  aliases: ["job", "w"],

  async execute(message) {
    let user = await User.findOne({
      userId: message.author.id
    });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    if (!user.work) {
      user.work = {
        lastWork: null
      };
    }

    if (user.work.lastWork) {
      const elapsed = Date.now() - user.work.lastWork.getTime();

      if (elapsed < cooldown) {
        const remaining = cooldown - elapsed;

        const minutes = Math.floor(
          remaining / (60 * 1000)
        );

        return message.reply(
          `⏳ You're tired! Try working again in **${minutes} minutes**.`
        );
      }
    }

    const job =
      jobs[Math.floor(Math.random() * jobs.length)];

    const reward =
      BigInt(job.min) +
      BigInt(
        Math.floor(
          Math.random() * (job.max - job.min + 1)
        )
      );

    const wallet = BigInt(user.wallet || "0");
    const newWallet = wallet + reward;

    user.wallet = newWallet.toString();
    user.work.lastWork = new Date();

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("💼 Work Complete!")
      .setDescription(
        `You worked as a **${job.name}**!\n\n` +
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