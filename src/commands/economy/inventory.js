const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  name: "inventory",
  aliases: ["inv", "items", "bag"],

  async execute(message) {
    let user = await User.findOne({ userId: message.author.id });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    if (!user.inventory.length) {
      return message.reply("🎒 Your inventory is empty.");
    }

    const itemCounts = {};

    for (const item of user.inventory) {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    }

    const lines = Object.entries(itemCounts).map(
      ([item, amount]) => `• **${item}** × ${amount}`
    );

    const embed = new EmbedBuilder()
      .setTitle(`🎒 ${message.author.username}'s Inventory`)
      .setDescription(lines.join("\n"))
      .setColor(0x2b2d31)
      .setFooter({
        text: `${user.inventory.length} total item(s)`
      })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};