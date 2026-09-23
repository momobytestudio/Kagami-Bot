const { EmbedBuilder } = require("discord.js");
const isDeveloper = require("../utils/isDeveloper");

module.exports = {
  name: "botstat",
  aliases: ["botstats", "status"],

  async execute(message) {
    if (!isDeveloper(message.author.id)) {
      return message.reply(
        "❌ This command is restricted to Kagami developers."
      );
    }

    const client = message.client;
    const memory = process.memoryUsage();

    const uptimeSeconds = Math.floor(
      client.uptime / 1000
    );

    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor(
      (uptimeSeconds % 86400) / 3600
    );
    const minutes = Math.floor(
      (uptimeSeconds % 3600) / 60
    );
    const seconds = uptimeSeconds % 60;

    const uptime =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const embed = new EmbedBuilder()
      .setTitle("🛠️ Kagami Bot Status")
      .addFields(
        {
          name: "🤖 Bot",
          value: `**${client.user.tag}**`,
          inline: true
        },
        {
          name: "📡 API Latency",
          value: `**${Math.round(client.ws.ping)}ms**`,
          inline: true
        },
        {
          name: "🌐 Servers",
          value: `**${client.guilds.cache.size}**`,
          inline: true
        },
        {
          name: "👥 Cached Users",
          value: `**${client.users.cache.size}**`,
          inline: true
        },
        {
          name: "⏱️ Uptime",
          value: `**${uptime}**`,
          inline: true
        },
        {
          name: "💾 Memory",
          value:
            `RSS: **${Math.round(
              memory.rss / 1024 / 1024
            )} MB**\n` +
            `Heap: **${Math.round(
              memory.heapUsed / 1024 / 1024
            )} MB**`,
          inline: true
        }
      )
      .setColor(0x2b2d31)
      .setFooter({
        text: "Developer diagnostics"
      })
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};