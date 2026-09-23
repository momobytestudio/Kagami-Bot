const { EmbedBuilder } = require("discord.js");
const User = require("../models/User");
const isDeveloper = require("../utils/isDeveloper");

module.exports = {
  name: "ecoaverage",
  aliases: ["ecoavg", "average"],

  async execute(message) {
    if (!isDeveloper(message.author.id)) {
      return message.reply(
        "❌ This command is restricted to Kagami developers."
      );
    }

    const users = await User.find({}).lean();

    if (!users.length) {
      return message.reply(
        "❌ No economy users exist yet."
      );
    }

    let totalWealth = 0n;
    let totalWallet = 0n;
    let totalBank = 0n;

    for (const user of users) {
      totalWallet += BigInt(user.wallet || "0");
      totalBank += BigInt(user.bank || "0");
    }

    totalWealth = totalWallet + totalBank;

    const userCount = BigInt(users.length);

    const averageWallet =
      totalWallet / userCount;

    const averageBank =
      totalBank / userCount;

    const averageWealth =
      totalWealth / userCount;

    const embed = new EmbedBuilder()
      .setTitle("📊 Economy Average")
      .setDescription(
        `Based on **${users.length.toLocaleString()}** economy users.`
      )
      .addFields(
        {
          name: "💵 Average Wallet",
          value: `$${averageWallet.toLocaleString()}`
        },
        {
          name: "🏦 Average Bank",
          value: `$${averageBank.toLocaleString()}`
        },
        {
          name: "🪙 Average Total Wealth",
          value: `$${averageWealth.toLocaleString()}`
        },
        {
          name: "💰 Total Economy",
          value: `$${totalWealth.toLocaleString()}`
        }
      )
      .setColor(0x2b2d31)
      .setFooter({
        text: "Developer economy analytics"
      })
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};