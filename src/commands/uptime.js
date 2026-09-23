const { EmbedBuilder } = require("discord.js");
const isDeveloper = require("../utils/isDeveloper");

function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

module.exports = {
  name: "uptime",
  aliases: ["up"],

  async execute(message) {
    if (!isDeveloper(message.author.id)) {
      return message.reply(
        "❌ This command is restricted to Kagami developers."
      );
    }

    const uptime = formatUptime(message.client.uptime);

    const embed = new EmbedBuilder()
      .setTitle("⏱️ Kagami Uptime")
      .setDescription(
        `The bot has been online for:\n\n` +
        `**${uptime}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};