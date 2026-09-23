const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  name: "profile",
  aliases: ["p", "me", "stats"],

  async execute(message) {
    let user = await User.findOne({
      userId: message.author.id
    });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    const wallet = BigInt(user.wallet || "0");
    const bank = BigInt(user.bank || "0");
    const total = wallet + bank;

    const inventoryCount = user.inventory?.length || 0;
    const dailyStreak = user.daily?.streak || 0;

    const embed = new EmbedBuilder()
      .setTitle(`⭐ ${message.author.username}'s Profile`)
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(
        `💵 **Wallet:** $${wallet.toLocaleString()}\n` +
        `🏦 **Bank:** $${bank.toLocaleString()}\n` +
        `🪙 **Total Wealth:** $${total.toLocaleString()}\n\n` +
        `🎒 **Items:** ${inventoryCount}\n` +
        `🔥 **Daily Streak:** ${dailyStreak}`
      )
      .setColor(0x2b2d31)
      .setFooter({
        text: "Kagami • Economy"
      })
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};