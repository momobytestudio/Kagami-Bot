const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const parseAmount = require("../../utils/numberParser");

module.exports = {
  name: "coinflip",
  aliases: ["cf", "flip"],

  async execute(message, args) {
    if (!args[0]) {
      return message.reply(
        "❌ Please specify a bet. Example: `,coinflip 10k`"
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

    const result =
      Math.random() < 0.5 ? "Heads" : "Tails";

    const won = Math.random() < 0.5;

    const newWallet = won
      ? wallet + bet
      : wallet - bet;

    user.wallet = newWallet.toString();

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🪙 Coin Flip")
      .setDescription(
        `The coin landed on **${result}**!\n\n` +
        (won
          ? `🎉 You won **$${bet.toLocaleString()}**!`