const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const shopItems = require("../../utils/shopItems");

module.exports = {
  name: "buy",
  aliases: ["purchase", "shopbuy"],

  async execute(message, args) {
    if (!args[0]) {
      return message.reply(
        "❌ Please specify an item. Example: `,buy kagami_charm`"
      );
    }

    const itemId = args[0].toLowerCase();
    const item = shopItems.find((shopItem) => shopItem.id === itemId);

    if (!item) {
      return message.reply(
        "❌ That item doesn't exist. Use `,shop` to view the available items."
      );
    }

    let user = await User.findOne({ userId: message.author.id });

    if (!user) {
      user = await User.create({
        userId: message.author.id
      });
    }

    const wallet = BigInt(
      user.wallet ? user.wallet.toString().split(".")[0] : "0"
    );

    const price = BigInt(item.price);

    if (wallet < price) {
      return message.reply(
        `❌ You need **$${price.toLocaleString()}** but only have **$${wallet.toLocaleString()}** in your wallet.`
      );
    }

    user.wallet = (wallet - price).toString();
    user.inventory.push(item.id);

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🛍️ Purchase Complete")
      .setDescription(
        `You bought **${item.name}**!\n\n` +
        `💰 Price: **$${price.toLocaleString()}**\n` +
        `💵 Remaining wallet: **$${(wallet - price).toLocaleString()}**`
      )
      .setColor(0x2b2d31)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};