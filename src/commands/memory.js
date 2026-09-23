const { EmbedBuilder } = require("discord.js");
const isDeveloper = require("../utils/isDeveloper");

function formatMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

module.exports = {
  name: "memory",
  aliases: ["mem", "ram"],

  async execute(message) {
    if (!isDeveloper(message.author.id)) {
      return message.reply(
        "❌ This command is restricted to Kagami developers."
      );
    }

    const memory = process.memoryUsage();

    const embed = new EmbedBuilder()
      .setTitle("💾 Kagami Memory Usage")
      .addFields(
        {
          name: "📦 RSS",
          value: `**${formatMB(memory.rss)}**`,
          inline: true
        },
        {
          name: "🧠 Heap Used",
          value: `**${formatMB(memory.heapUsed)}**`,
          inline: true
        },
        {
          name: "📚 Heap Total",
          value: `**${formatMB(memory.heapTotal)}**`,
          inline: true
        },
        {
          name: "🔗 External",
          value: `**${formatMB(memory.external)}**`,
          inline: true
        },
        {
          name: "🧩 Array Buffers",
          value: `**${formatMB(memory.arrayBuffers)}**`,
          inline: true
        }
      )
      .setColor(0x2b2d31)
      .setFooter({
        text: "Developer memory diagnostics"
      })
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};