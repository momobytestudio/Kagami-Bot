const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  name: "credits",
  aliases: ["credit", "crd"],

  async execute(message) {
    let user = await User.findOne({
      userId: message.author.id
    });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    const credits = BigInt(user.credits || "0");

    const embed = new EmbedBuilder()
      .setTitle("🪙 Kagami Credits")
      .setDescription(
        `**${message.author.username}**, you currently have:\n\n` +
        `🪙 **${credits.toLocaleString()} Credits**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};