const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const parseAmount = require("../../utils/numberParser");

module.exports = {
  name: "withdraw",
  aliases: ["with", "wd"],

  async execute(message, args) {
    if (!args[0]) {
      return message.reply(
        "❌ Please specify an amount. Example: `,withdraw 100k`"
      );
    }

    const amount = parseAmount(args[0]);

    if (amount === null || amount <= 0n) {
      return message.reply("❌ That's not a valid amount.");
    }

    let user = await User.findOne({
      userId: message.author.id
    });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    const bank = BigInt(user.bank || "0");

    if (amount > bank) {
      return message.reply(
        "❌ You don't have enough money in your bank."
      );
    }

    const wallet = BigInt(user.wallet || "0");

    const newBank = bank - amount;
    const newWallet = wallet + amount;

    user.bank = newBank.toString();
    user.wallet = newWallet.toString();

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🏦 Withdrawal")
      .setDescription(
        `Withdrew **$${amount.toLocaleString()}** from your bank.\n\n` +
        `💵 Wallet: **$${newWallet.toLocaleString()}**\n` +
        `🏦 Bank: **$${newBank.toLocaleString()}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};