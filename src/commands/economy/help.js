const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h", "commands", "menu"],

  async execute(message) {
    const embed = new EmbedBuilder()
      .setTitle("⭐ Kagami Economy")
      .setDescription(
        "Welcome to Kagami's global economy!\n" +
        "Use `,` before every command."
      )
      .addFields(
        {
          name: "💰 Money",
          value:
            "`,balance` — Check your balance\n" +
            "`,deposit <amount>` — Deposit money\n" +
            "`,withdraw <amount>` — Withdraw money\n" +
            "`,pay @user <amount>` — Send money"
        },
        {
          name: "🎁 Rewards",
          value:
            "`,daily` — Daily reward\n" +
            "`,work` — Work for money\n" +
            "`,beg` — Beg for money"
        },
        {
          name: "🚨 Risk",
          value:
            "`,crime` — Commit a crime\n" +
            "`,rob @user` — Rob another player"
        },
        {
          name: "🛍️ Items",
          value:
            "`,shop` — View the shop\n" +
            "`,buy <item>` — Buy an item\n" +
            "`,inventory` — View your items"
        },
        {
          name: "🎰 Games",
          value:
            "`,slots <amount>` — Play slots\n" +
            "`,coinflip <amount>` — Flip a coin\n" +
            "`,roulette <amount>` — Play roulette"
        },
        {
          name: "🏆 Rankings",
          value:
            "`,leaderboard` — Global leaderboard\n" +
            "`,serverleaderboard` — Server leaderboard"
        },
        {
          name: "👤 Profile",
          value:
            "`,profile` — View your economy profile"
        }
      )
      .setColor(0x2b2d31)
      .setFooter({
        text: "⭐ Kagami • Global Economy"
      })
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};