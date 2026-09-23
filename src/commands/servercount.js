const { EmbedBuilder } = require("discord.js");
const isDeveloper = require("../utils/isDeveloper");

module.exports = {
  name: "servercount",
  aliases: ["servers", "guilds"],

  async execute(message) {
    if (!isDeveloper(message.author.id)) {
      return message.reply(
        "❌ This command is restricted to Kagami developers."
      );
    }

    const client = message.client;

    let totalMembers = 0;

    for (const guild of client.guilds.cache.values()) {
      totalMembers += guild.memberCount;
    }

    const embed = new EmbedBuilder()
      .setTitle("🌐 Kagami Server Statistics")
      .addFields(
        {
          name: "🏠 Servers",
          value: `**${client.guilds.cache.size.toLocaleString()}**`,
          inline: true
        },
        {
          name: "👥 Total Members",
          value: `**${totalMembers.toLocaleString()}**`,
          inline: true
        },
        {
          name: "📡 Cached Users",
          value: `**${client.users.cache.size.toLocaleString()}**`,
          inline: true
        }
      )
      .setColor(0x2b2d31)
      .setFooter({
        text: "Developer server statistics"
      })
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};