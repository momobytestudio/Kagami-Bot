const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  name: "balance",
  aliases: ["bal"],

  async execute(message) {
    let user = await User.findOne({ userId: message.author.id });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`${message.author.username}'s Balance`)
      .setDescription(
        `💵 **Wallet:** $${user.wallet.toLocaleString()}\n` +
        `🏦 **Bank:** $${user.bank.toLocaleString()}\n\n` +
        `💰 **Total:** $${(user.wallet + user.bank).toLocaleString()}`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
