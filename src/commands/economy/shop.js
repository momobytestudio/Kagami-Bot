const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const shopItems = require("../../utils/shopItems");

module.exports = {
  name: "shop",
  aliases: ["store", "market"],

  async execute(message) {
    const itemsPerPage = 5;
    let page = 0;

    const getEmbed = () => {
      const start = page * itemsPerPage;
      const items = shopItems.slice(start, start + itemsPerPage);

      const description = items
        .map(
          (item) =>
            `${item.name}\n` +
            `💰 **$${item.price.toLocaleString()}**\n` +
            `${item.description}`
        )
        .join("\n\n");

      return new EmbedBuilder()
        .setTitle("⭐ General Shop")
        .setDescription(description || "The shop is empty.")
        .setFooter({
          text: `Page ${page + 1} / ${Math.max(
            1,
            Math.ceil(shopItems.length / itemsPerPage)
          )}`
        })
        .setColor(0x2b2d31)
        .setTimestamp();
    };

    const getRow = () =>
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("shop_previous")
          .setLabel("◀ Previous")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 0),

        new ButtonBuilder()
          .setCustomId("shop_next")
          .setLabel("Next ▶")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(
            page >= Math.ceil(shopItems.length / itemsPerPage) - 1
          )
      );

    const reply = await message.reply({
      embeds: [getEmbed()],
      components: [getRow()]
    });

    const collector = reply.createMessageComponentCollector({
      time: 120000
    });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({
          content: "❌ Only the person who opened this shop can use these buttons.",
          ephemeral: true
        });
      }

      if (interaction.customId === "shop_previous") {
        page--;
      }

      if (interaction.customId === "shop_next") {
        page++;
      }

      await interaction.update({
        embeds: [getEmbed()],
        components: [getRow()]
      });
    });

    collector.on("end", async () => {
      await reply.edit({
        components: []
      }).catch(() => {});
    });
  }
};