const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  name: "serverleaderboard",
  aliases: ["slb"],

  async execute(message) {
    const members = await message.guild.members.fetch();

    const users = await User.find({
      userId: { $in: [...members.keys()] }
    }).lean();

    users.sort((a, b) => {
      const aTotal =
        BigInt(a.wallet?.toString().split(".")[0] || "0") +
        BigInt(a.bank?.toString().split(".")[0] || "0");

      const bTotal =
        BigInt(b.wallet?.toString().split(".")[0] || "0") +
        BigInt(b.bank?.toString().split(".")[0] || "0");

      if (aTotal === bTotal) return 0;
      return aTotal > bTotal ? -1 : 1;
    });

    const topUsers = users.slice(0, 10);

    if (!topUsers.length) {
      return message.reply("❌ No economy users exist in this server yet.");
    }

    const lines = topUsers.map((user, index) => {
      const member = members.get(user.userId);

      const wallet = BigInt(
        user.wallet?.toString().split(".")[0] || "0"
      );

      const bank = BigInt(
        user.bank?.toString().split(".")[0] || "0"
      );

      const total = wallet + bank;

      return `**${index + 1}.** ${
        member ? member.user.username : "Unknown User"
      } — **$${total.toLocaleString()}**`;
    });

    const embed = new EmbedBuilder()
      .setTitle(`🏆 ${message.guild.name} Leaderboard`)
      .setDescription(lines.join("\n"))
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};