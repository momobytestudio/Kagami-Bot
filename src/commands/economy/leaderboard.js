const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  name: "leaderboard",
  aliases: ["lb"],

  async execute(message) {
    const users = await User.find({}).lean();

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
      return message.reply("❌ No economy users exist yet.");
    }

    const lines = await Promise.all(
      topUsers.map(async (user, index) => {
        const discordUser = await message.client.users
          .fetch(user.userId)
          .catch(() => null);

        const wallet = BigInt(
          user.wallet?.toString().split(".")[0] || "0"
        );

        const bank = BigInt(
          user.bank?.toString().split(".")[0] || "0"
        );

        const total = wallet + bank;

        return `**${index + 1}.** ${
          discordUser ? discordUser.username : "Unknown User"
        } — **$${total.toLocaleString()}**`;
      })
    );

    const embed = new EmbedBuilder()
      .setTitle("🌎 Global Economy Leaderboard")
      .setDescription(lines.join("\n"))
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};