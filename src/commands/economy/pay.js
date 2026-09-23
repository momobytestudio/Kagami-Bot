const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const parseAmount = require("../../utils/numberParser");

module.exports = {
  name: "pay",
  aliases: ["give", "send", "transfer"],

  async execute(message, args) {
    const target = message.mentions.users.first();

    if (!target) {
      return message.reply(
        "❌ Please mention a user. Example: `,pay @User 100k`"
      );
    }

    if (target.bot) {
      return message.reply("❌ You can't send money to bots.");
    }

    if (target.id === message.author.id) {
      return message.reply("❌ You can't send money to yourself.");
    }

    if (!args[1]) {
      return message.reply(
        "❌ Please specify an amount. Example: `,pay @User 100k`"
      );
    }

    const amount = parseAmount(args[1]);

    if (amount === null || amount <= 0n) {
      return message.reply("❌ That's not a valid amount.");
    }

    let sender = await User.findOne({
      userId: message.author.id
    });

    if (!sender) {
      sender = await User.create({
        userId: message.author.id
      });
    }

    let receiver = await User.findOne({
      userId: target.id
    });

    if (!receiver) {
      receiver = await User.create({
        userId: target.id
      });
    }

    const senderWallet = BigInt(sender.wallet || "0");

    if (amount > senderWallet) {
      return message.reply(
        "❌ You don't have enough money in your wallet."
      );
    }

    const receiverWallet = BigInt(receiver.wallet || "0");

    const newSenderWallet = senderWallet - amount;
    const newReceiverWallet = receiverWallet + amount;

    sender.wallet = newSenderWallet.toString();
    receiver.wallet = newReceiverWallet.toString();

    await sender.save();
    await receiver.save();

    const embed = new EmbedBuilder()
      .setTitle("💸 Money Sent")
      .setDescription(
        `You sent **$${amount.toLocaleString()}** to ${target}.\n\n` +
        `💵 Your wallet: **$${newSenderWallet.toLocaleString()}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};