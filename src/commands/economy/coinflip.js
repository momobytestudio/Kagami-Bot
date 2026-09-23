const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const parseAmount = require("../../utils/numberParser");

const cooldown = 30 * 1000;

module.exports = {
  name: "coinflip",
  aliases: ["cf", "flip"],

  async execute(message, args) {
    const bet = parseAmount(args[0]);

    if (bet === null || bet <= 0n) {
      return message.reply(
        "❌ Please enter a valid amount. Example: `,coinflip 10k`"
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
      return message.reply("❌ You don't have enough money.");
    }

    if (!user.coinflip) {
      user.coinflip = {
        lastFlip: null
      };
    }

    if (user.coinflip.lastFlip) {
      const elapsed =
        Date.now() - user.coinflip.lastFlip.getTime();

      if (elapsed < cooldown) {
        const remaining = Math.ceil(
          (cooldown - elapsed) / 1000
        );

        return message.reply(
          `⏳ You can flip again in **${remaining}s**.`
        );
      }
    }

    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    const won = Math.random() < 0.5;

    let newWallet;

    if (won) {
      newWallet = wallet + bet;
    } else {
      newWallet = wallet - bet;
    }

    user.wallet = newWallet.toString();
    user.coinflip.lastFlip = new Date();

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🪙 Coin Flip")
      .setDescription(
        `The coin landed on **${result}**!\n\n` +
        (won
          ? `🎉 You won **$${bet.toLocaleString()}**!`
          : `💀 You lost **$${bet.toLocaleString()}**!`) +
        `\n\n💵 Wallet: **$${newWallet.toLocaleString()}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({
      embeds: [embed]
    });
  }
};