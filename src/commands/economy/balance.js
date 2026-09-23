const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  name: "balance",
  aliases: ["bal", "cash", "money"],

  async execute(message) {
    let user = await User.findOne({
      userId: message.author.id
    });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    const wallet = BigInt(user.wallet || "0");
    const bank = BigInt(user.bank || "0");
    const total = wallet + bank;

    const embed = new EmbedBuilder()
      .setTitle(`${message.author.username}'s Balance`)
      .setDescription(
        `💵 **Wallet:** $${wallet.toLocaleString()}\n` +
        `🏦 **Bank:** $${bank.toLocaleString()}\n\n` +
        `🪙 **Total:** $${total.toLocaleString()}`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};