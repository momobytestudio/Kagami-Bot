const { EmbedBuilder } = require("discord.js");
const User = require("../models/User");
const isDeveloper = require("../utils/isDeveloper");

module.exports = {
  name: "ecostats",
  aliases: ["economystats", "estats"],

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

    let totalWallet = 0n;
    let totalBank = 0n;
    let richest = null;
    let richestTotal = 0n;
    let inventoryItems = 0;

    for (const user of users) {
      const wallet = BigInt(user.wallet || "0");
      const bank = BigInt(user.bank || "0");
      const total = wallet + bank;

      totalWallet += wallet;
      totalBank += bank;

      inventoryItems += user.inventory?.length || 0;

      if (richest === null || total > richestTotal) {
        richest = user;
        richestTotal = total;
      }
    }

    const totalWealth = totalWallet + totalBank;

    const embed = new EmbedBuilder()
      .setTitle("📊 Kagami Economy Statistics")
      .addFields(
        {
          name: "👥 Economy Users",
          value: `**${users.length.toLocaleString()}**`,
          inline: true
        },
        {
          name: "💵 Total Wallet",
          value: `$${totalWallet.toLocaleString()}`,
          inline: true
        },
        {
          name: "🏦 Total Bank",
          value: `$${totalBank.toLocaleString()}`,
          inline: true
        },
        {
          name: "🪙 Total Economy",
          value: `$${totalWealth.toLocaleString()}`,
          inline: true
        },
        {
          name: "🎒 Items Owned",
          value: `**${inventoryItems.toLocaleString()}**`,
          inline: true
        },
        {
          name: "💎 Richest Player",
          value: richest
            ? `<@${richest.userId}>\n$${richestTotal.toLocaleString()}`
            : "None",
          inline: true
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