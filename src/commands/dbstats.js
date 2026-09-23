const { EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const User = require("../models/User");
const isDeveloper = require("../utils/isDeveloper");

module.exports = {
  name: "dbstats",
  aliases: ["database", "db"],

  async execute(message) {
    if (!isDeveloper(message.author.id)) {
      return message.reply(
        "❌ This command is restricted to Kagami developers."
      );
    }

    const userCount = await User.countDocuments();

    const state = mongoose.connection.readyState;

    const status = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting"
    };

    const embed = new EmbedBuilder()
      .setTitle("🗄️ Database Statistics")
      .addFields(
        {
          name: "📡 Connection",
          value: `**${status[state] || "Unknown"}**`,
          inline: true
        },
        {
          name: "👥 Economy Users",
          value: `**${userCount.toLocaleString()}**`,
          inline: true
        },
        {
          name: "🗃️ Database",
          value: `**${mongoose.connection.name || "Unknown"}**`,
          inline: true
        },
        {
          name: "🌐 Host",
          value: `**${mongoose.connection.host || "Unknown"}**`,
          inline: true
        }
      )
      .setColor(0x2b2d31)
      .setFooter({
        text: "Developer database diagnostics"
      })
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};