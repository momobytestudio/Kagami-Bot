const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const messageCreate = require("./events/messageCreate");

client.on("messageCreate", messageCreate);

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

async function startBot() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startBot();
