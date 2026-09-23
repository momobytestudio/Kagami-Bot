const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  name: "serverleaderboard",
  aliases: ["slb"],

  async execute(message) {
    const memberIds = message.guild.members.cache
      .filter((member) => !member.user.bot)
      .map((member) => member.id);

    const users = await User.find({
      userId: { $in: memberIds }
    }).lean();

    users.sort((a, b) => {
      const aTotal =
        BigInt(a.wallet || "0") +
        BigInt(a.bank || "0");

      const bTotal =
        BigInt(b.wallet || "0") +
        BigInt(b.bank || "0");

      if (aTotal === bTotal) return 0;

      return aTotal > bTotal ? -1 : 1;
    });

    const topUsers = users.slice(0, 10);

    if (!topUsers.length) {
      return message.reply(
        "❌ No economy users exist in this server yet."
      );
    }

    const lines = topUsers.map((user, index) => {
      const member = message.guild.members.cache.get(
        user.userId
      );

      const wallet = BigInt(user.wallet || "0");
      const bank = BigInt(user.bank || "0");
      const total = wallet + bank;

      return (
        `**${index + 1}.** ` +
        `${member ? member.user.username : "Unknown User"} ` +
        `— **$${total.toLocaleString()}**`
      );
    });

    const embed = new EmbedBuilder()
      .setTitle(`🏆 ${message.guild.name} Leaderboard`)
      .setDescription(lines.join("\n"))
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};