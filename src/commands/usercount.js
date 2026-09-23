const { EmbedBuilder } = require("discord.js");
const isDeveloper = require("../utils/isDeveloper");

module.exports = {
  name: "usercount",
  aliases: ["users", "userstats"],

  async execute(message) {
    if (!isDeveloper(message.author.id)) {
      return message.reply(
        "❌ This command is restricted to Kagami developers."
      );
    }

    const client = message.client;

    let totalMembers = 0;
    let humans = 0;
    let bots = 0;

    for (const guild of client.guilds.cache.values()) {
      totalMembers += guild.memberCount;

      const members = guild.members.cache;

      for (const member of members.values()) {
        if (member.user.bot) {
          bots++;
        } else {
          humans++;
        }
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("👥 Kagami User Statistics")
      .addFields(
        {
          name: "👤 Total Members",
          value: `**${totalMembers.toLocaleString()}**`,
          inline: true
        },
        {
          name: "🙂 Cached Humans",
          value: `**${humans.toLocaleString()}**`,
          inline: true
        },
        {
          name: "🤖 Cached Bots",
          value: `**${bots.toLocaleString()}**`,
          inline: true
        },
        {
          name: "💾 Cached Users",
          value: `**${client.users.cache.size.toLocaleString()}**`,
          inline: true
        }
      )
      .setColor(0x2b2d31)
      .setFooter({
        text: "Developer user statistics"
      })
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};