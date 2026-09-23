const fs = require("fs");
const path = require("path");

const commands = new Map();

function loadCommands(dir) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      loadCommands(fullPath);
      continue;
    }

    if (!entry.name.endsWith(".js")) continue;

    const command = require(fullPath);

    if (!command.name || typeof command.execute !== "function") continue;

    commands.set(command.name.toLowerCase(), command);

    if (Array.isArray(command.aliases)) {
      for (const alias of command.aliases) {
        commands.set(alias.toLowerCase(), command);
      }
    }
  }
}

loadCommands(path.join(__dirname, "..", "commands"));

console.log(`Loaded ${commands.size} command/alias entries.`);

module.exports = async function messageCreate(message) {
  console.log(`Message received: ${message.author.tag}: ${message.content}`);

  if (message.author.bot) return;

  const prefix = process.env.BOT_PREFIX || ",";

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();

  console.log(`Command detected: ${commandName}`);

  const command = commands.get(commandName);

  if (!command) {
    console.log(`Command not found: ${commandName}`);
    return;
  }

  try {
    await command.execute(message, args);
    console.log(`Command executed: ${commandName}`);
  } catch (error) {
    console.error("Command error:", error);
  }
};
