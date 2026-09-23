const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const parseAmount = require("../../utils/numberParser");

module.exports = {
  name: "roulette",
  aliases: ["roll", "rt"],

  async execute(message, args) {
    if (!args[0]) {
      return message.reply(
        "❌ Please specify a bet. Example: `,roulette 10k`"
      );
    }

    const bet = parseAmount(args[0]);

    if (bet === null || bet <= 0n) {
      return message.reply("❌ That's not a valid bet.");
    }

    let user = await User.findOne({
      userId: message.author.id
    });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    const wallet = BigInt(user.wallet || "0");

    if (bet > wallet) {
      return message.reply(
        "❌ You don't have enough money in your wallet."
      );
    }

    const number = Math.floor(Math.random() * 37);

    const won = number === 0;

    const winnings = won ? bet * 35n : 0n;

    const newWallet = wallet - bet + winnings;

    user.wallet = newWallet.toString();

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🎡 MMBYTE Roulette")
      .setDescription(
        `🎯 The wheel landed on **${number}**!\n\n` +
        (won
          ? `💎 **JACKPOT!** You won **$${winnings.toLocaleString()}**!`
          : `💸 You lost **$${bet.toLocaleString()}**.`) +
        `\n\n💵 Wallet: **$${newWallet.toLocaleString()}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};