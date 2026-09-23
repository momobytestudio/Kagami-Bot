const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  name: "balance",
  aliases: ["bal", "cash", "money"],

  async execute(message) {
    let user = await User.findOne({ userId: message.author.id });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    const wallet = user.wallet ? user.wallet.toString() : "0";
    const bank = user.bank ? user.bank.toString() : "0";

    const total =
      BigInt(wallet.split(".")[0]) +
      BigInt(bank.split(".")[0]);

    const embed = new EmbedBuilder()
      .setTitle(`${message.author.username}'s Balance`)
      .setDescription(
        `💵 **Wallet:** $${BigInt(wallet.split(".")[0]).toLocaleString()}\n` +
        `🏦 **Bank:** $${BigInt(bank.split(".")[0]).toLocaleString()}\n\n` +
        `🪙 **Total:** $${total.toLocaleString()}`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};