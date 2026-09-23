const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

const cooldown = 30 * 60 * 1000;

module.exports = {
  name: "rob",
  aliases: ["steal"],

  async execute(message, args) {
    const target =
      message.mentions.users.first() ||
      (args[0]
        ? await message.client.users.fetch(args[0]).catch(() => null)
        : null);

    if (!target) {
      return message.reply(
        "❌ Please mention a user to rob. Example: `,rob @user`"
      );
    }

    if (target.id === message.author.id) {
      return message.reply("❌ You can't rob yourself.");
    }

    if (target.bot) {
      return message.reply("❌ You can't rob a bot.");
    }

    let user = await User.findOne({
      userId: message.author.id
    });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    if (!user.rob) {
      user.rob = {
        lastRob: null
      };
    }

    if (user.rob.lastRob) {
      const elapsed =
        Date.now() - user.rob.lastRob.getTime();

      if (elapsed < cooldown) {
        const remaining = Math.ceil(
          (cooldown - elapsed) / 1000
        );

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        return message.reply(
          `⏳ You can rob again in **${minutes}m ${seconds}s**.`
        );
      }
    }

    let victim = await User.findOne({
      userId: target.id
    });

    if (!victim) {
      victim = await User.create({
        userId: target.id
      });
    }

    const robberWallet = BigInt(user.wallet || "0");
    const victimWallet = BigInt(victim.wallet || "0");

    if (victimWallet <= 0n) {
      return message.reply(
        `❌ <@${target.id}> doesn't have any money in their wallet to rob.`
      );
    }

    const success = Math.random() < 0.45;

    user.rob.lastRob = new Date();

    if (!success) {
      await user.save();

      const embed = new EmbedBuilder()
        .setTitle("🚨 Robbery Failed")
        .setDescription(
          `You tried to rob **${target.username}** but got caught!\n\n` +
          `💀 You got away empty-handed.`
        )
        .setColor(0xff0000)
        .setTimestamp();

      return message.reply({
        embeds: [embed]
      });
    }

    /*
     * Rob between 10% and 30% of the victim's wallet.
     * BigInt is used throughout so huge balances remain safe.
     */
    const minPercent = 10n;
    const maxPercent = 30n;

    const percent =
      minPercent +
      BigInt(
        Math.floor(
          Math.random() *
            Number(maxPercent - minPercent + 1n)
        )
      );

    let amount = (victimWallet * percent) / 100n;

    if (amount < 1n) {
      amount = 1n;
    }

    if (amount > victimWallet) {
      amount = victimWallet;
    }

    const newRobberWallet = robberWallet + amount;
    const newVictimWallet = victimWallet - amount;

    user.wallet = newRobberWallet.toString();
    victim.wallet = newVictimWallet.toString();

    await user.save();
    await victim.save();

    const embed = new EmbedBuilder()
      .setTitle("💰 Successful Robbery")
      .setDescription(
        `You successfully robbed **${target.username}**!\n\n` +
        `💵 Stolen: **$${amount.toLocaleString()}**\n` +
        `💰 Your Wallet: **$${newRobberWallet.toLocaleString()}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};