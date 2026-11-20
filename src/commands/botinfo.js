const {
  EmbedBuilder
} = require("discord.js");

module.exports = {
  name: "botinfo",
  aliases: ["about", "info"],

  async execute(message) {
    const client = message.client;

    const embed = new EmbedBuilder()
      .setTitle("<:KagamiBwaa:1551605541451735202> Kagami")
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
          name: "<:Star_Currency:1572392950460055574> Economy",
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