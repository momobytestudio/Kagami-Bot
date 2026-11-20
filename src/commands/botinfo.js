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
        "A global Discord economy bot."
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
          name: "⭐ server",
          value: "https://discord.gg/fVbK5uGzhN",
          inline: true
        }
      )
      .setColor(0x2b2d31)
      .setFooter({
        text: momobyte"
      })
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};