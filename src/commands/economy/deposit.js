const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const parseAmount = require("../../utils/numberParser");

module.exports = {
  name: "deposit",
  aliases: ["dep", "bank"],

  async execute(message, args) {
    if (!args[0]) {
      return message.reply(
        "❌ Please specify an amount. Example: `,deposit 100k`"
      );
    }

    const amount = parseAmount(args[0]);

    if (amount === null || amount <= 0n) {
      return message.reply("❌ That's not a valid amount.");
    }

    let user = await User.findOne({ userId: message.author.id });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    const wallet = BigInt(user.wallet.toString().split(".")[0]);

    if (amount > wallet) {
      return message.reply("❌ You don't have enough money in your wallet.");
    }

    const bank = BigInt(user.bank.toString().split(".")[0]);

    user.wallet = (wallet - amount).toString();
    user.bank = (bank + amount).toString();

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🏦 Deposit")
      .setDescription(
        `Deposited **$${amount.toLocaleString()}** into your bank.\n\n` +
        `💵 Wallet: **$${(wallet - amount).toLocaleString()}**\n` +
        `🏦 Bank: **$${(bank + amount).toLocaleString()}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};