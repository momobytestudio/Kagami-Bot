const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const User = require("../../models/User");
const shopItems = require("../../utils/shopItems");

module.exports = {
  name: "shop",
  aliases: ["store", "market"],

  async execute(message) {
    const itemsPerPage = 5;
    let page = 0;

    const maxPage = Math.max(
      0,
      Math.ceil(shopItems.length / itemsPerPage) - 1
    );

    const getItems = () => {
      const start = page * itemsPerPage;
      return shopItems.slice(start, start + itemsPerPage);
    };

    const getEmbed = () => {
      const items = getItems();

      return new EmbedBuilder()
        .setTitle("⭐ General Shop")
        .setDescription(
          items
            .map(
              (item) =>
                `${item.name}\n` +
                `💰 **$${item.price.toLocaleString()}**\n` +
                `${item.description}`
            )
            .join("\n\n")
        )
        .setFooter({
          text: `Page ${page + 1} / ${maxPage + 1}`
        })
        .setColor(0x2b2d31)
        .setTimestamp();
    };

    const getRows = () => {
      const items = getItems();

      const buyRow = new ActionRowBuilder();

      for (const item of items) {
        buyRow.addComponents(
          new ButtonBuilder()
            .setCustomId(`shop_buy_${item.id}`)
            .setLabel(`Buy ${item.id}`)
            .setStyle(ButtonStyle.Success)
        );
      }

      const navigationRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("shop_previous")
          .setLabel("◀ Previous")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 0),

        new ButtonBuilder()
          .setCustomId("shop_next")
          .setLabel("Next ▶")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === maxPage)
      );

      return [buyRow, navigationRow];
    };

    const reply = await message.reply({
      embeds: [getEmbed()],
      components: getRows()
    });

    const collector = reply.createMessageComponentCollector({
      time: 120000
    });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({
          content:
            "❌ Only the person who opened this shop can use these buttons.",
          ephemeral: true
        });
      }

      if (interaction.customId === "shop_previous") {
        page--;
      }

      if (interaction.customId === "shop_next") {
        page++;
      }

      if (interaction.customId.startsWith("shop_buy_")) {
        const itemId = interaction.customId.replace("shop_buy_", "");

        const item = shopItems.find(
          (shopItem) => shopItem.id === itemId
        );

        if (!item) {
          return interaction.reply({
            content: "❌ That item no longer exists.",
            ephemeral: true
          });
        }

        let user = await User.findOne({
          userId: interaction.user.id
        });

        if (!user) {
          user = await User.create({
            userId: interaction.user.id
          });
        }

        const wallet = BigInt(
          user.wallet?.toString().split(".")[0] || "0"
        );

        const price = BigInt(item.price);

        if (wallet < price) {
          return interaction.reply({
            content:
              `❌ You need **$${price.toLocaleString()}** but only have ` +
              `**$${wallet.toLocaleString()}**.`,
            ephemeral: true
          });
        }

        user.wallet = (wallet - price).toString();
        user.inventory.push(item.id);

        await user.save();

        return interaction.reply({
          content:
            `⭐ You bought **${item.name}** for ` +
            `**$${price.toLocaleString()}**!`,
          ephemeral: true
        });
      }

      await interaction.update({
        embeds: [getEmbed()],
        components: getRows()
      });
    });

    collector.on("end", async () => {
      await reply.edit({
        components: []
      }).catch(() => {});
    });
  }
};