const {
  EmbedBuilder
} = require("discord.js");

const User = require("../../models/User");
const parseAmount = require("../../utils/numberParser");

const symbols = ["🍒", "🍋", "🍇", "⭐", "💎", "7️⃣"];

module.exports = {
  name: "slots",
  aliases: ["slot"],

  async execute(message, args) {
    if (!args[0]) {
      return message.reply(
        "❌ Please specify a bet. Example: `,slots 10k`"
      );
    }

    const bet = parseAmount(args[0]);

    if (bet === null || bet <= 0n) {
      return message.reply(
        "❌ That's not a valid bet."
      );
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

    const result = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    let multiplier = 0;

    if (
      result[0] === result[1] &&
      result[1] === result[2]
    ) {
      multiplier = result[0] === "💎" ? 10 : 5;
    } else if (
      result[0] === result[1] ||
      result[1] === result[2] ||
      result[0] === result[2]
    ) {
      multiplier = 2;
    }

    const winnings = bet * BigInt(multiplier);
    const newWallet = wallet - bet + winnings;

    user.wallet = newWallet.toString();

    await user.save();

    let resultText;

    if (multiplier === 0) {
      resultText = `💸 You lost **$${bet.toLocaleString()}**.`;
    } else if (multiplier === 2) {
      resultText =
        `🎉 Two matching symbols! You won **$${winnings.toLocaleString()}**!`;
    } else {
      resultText =
        `🎰 JACKPOT! You won **$${winnings.toLocaleString()}**!`;
    }

    const embed = new EmbedBuilder()
      .setTitle("🎰 Kagami Slots")
      .setDescription(
        `**[ ${result.join(" | ")} ]**\n\n` +
        `${resultText}\n\n` +
        `💵 Wallet: **$${newWallet.toLocaleString()}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};