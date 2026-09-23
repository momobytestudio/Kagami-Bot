const {
  EmbedBuilder
} = require("discord.js");

module.exports = {
  name: "botinfo",
  aliases: ["about", "info"],

  async execute(message) {
    const client = message.client;

    const embed = new EmbedBuilder()
      .setTitle("⭐ Kagami")
      .setDescription(
        "A global Discord economy bot themed by the Lucky Star."
      )
      .addFields(
        {
          name: "🤖 Bot",
          value:
            `Name: **${client.user.username}**\n` +
            `ID: **${client.user.id}**`,
          inline: true
        },
        {
          name: "📊 Servers",
          value: `**${client.guilds.cache.size}**`,
          inline: true
        },
        {
          name: "👥 Users",
          value: `**${client.users.cache.size}**`,
          inline: true
        },
        {
          name: "⚙️ Commands",
          value: "Global prefix: **`,`**",
          inline: true
        },
        {
          name: "💰 Economy",
          value: "Global economy system",
          inline: true
        },
        {
          name: "⭐ Theme",
          value: "Lucky Star",
          inline: true
        }
      )
      .setColor(0x2b2d31)
      .setFooter({
        text: "Kagami • Global Economy"
      })
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};