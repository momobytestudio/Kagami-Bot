const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

const cooldown = 30 * 60 * 1000;
const successChance = 0.45;

module.exports = {
  name: "rob",
  aliases: ["steal"],

  async execute(message) {
    const target = message.mentions.users.first();

    if (!target) {
      return message.reply(
        "❌ Mention someone to rob. Example: `,rob @User`"
      );
    }

    if (target.bot) {
      return message.reply("❌ You can't rob bots.");
    }

    if (target.id === message.author.id) {
      return message.reply("❌ You can't rob yourself.");
    }

    let robber = await User.findOne({
      userId: message.author.id
    });

    if (!robber) {
      robber = await User.create({
        userId: message.author.id
      });
    }

    let victim = await User.findOne({
      userId: target.id
    });

    if (!victim) {
      victim = await User.create({
        userId: target.id
      });
    }

    if (!robber.rob) {
      robber.rob = {
        lastRob: null
      };
    }

    if (robber.rob.lastRob) {
      const elapsed =
        Date.now() - robber.rob.lastRob.getTime();

      if (elapsed < cooldown) {
        const remaining = cooldown - elapsed;

        const minutes = Math.ceil(
          remaining / (60 * 1000)
        );

        return message.reply(
          `⏳ You need to lay low for another **${minutes} minutes**.`
        );
      }
    }

    const victimWallet = BigInt(victim.wallet || "0");

    if (victimWallet <= 0n) {
      return message.reply(
        `❌ ${target} has no money in their wallet.`
      );
    }

    robber.rob.lastRob = new Date();

    if (Math.random() > successChance) {
      await robber.save();

      const embed = new EmbedBuilder()
        .setTitle("🚨 Robbery Failed")
        .setDescription(
          `You tried to rob ${target}...\n\n` +
          `🚔 You got caught and escaped with **$0**.`
        )
        .setColor(0x2b2d31)
        .setTimestamp();

      return message.reply({
        embeds: [embed]
      });
    }

    const maxAmount = victimWallet / 4n;

    const amount =
      maxAmount > 0n
        ? BigInt(
            Math.floor(
              Math.random() *
                Number(maxAmount > 1000000n ? 1000000n : maxAmount)
            ) + 1
          )
        : 1n;

    victim.wallet = (
      victimWallet - amount
    ).toString();

    const robberWallet = BigInt(
      robber.wallet || "0"
    );

    robber.wallet = (
      robberWallet + amount
    ).toString();

    await victim.save();
    await robber.save();

    const embed = new EmbedBuilder()
      .setTitle("💰 Robbery Successful!")
      .setDescription(
        `You robbed **$${amount.toLocaleString()}** from ${target}!\n\n` +
        `💵 Your wallet: **$${(robberWallet + amount).toLocaleString()}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};