const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: [],

  async execute(message) {
    const sent = await message.reply("🏓 Checking...");

    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(message.client.ws.ping);

    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setDescription(
        `📨 **Message:** ${latency}ms\n` +
        `💓 **API:** ${apiLatency}ms`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await sent.edit({
      content: "",
      embeds: [embed]
    });
  }
};