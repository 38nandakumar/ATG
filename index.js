const fs = require("fs");
const path = require("path");
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials
} = require("discord.js");

const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");

// Create Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.Channel]
});

// Distube Player
client.distube = new DisTube(client, {
  plugins: [new YtDlpPlugin()]
});

// Slash Commands Collection
client.commands = new Collection();

// Auto Load Commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// When Bot is Online
client.once("ready", () => {
  console.log(`Bot Online as ${client.user.tag}`);
});

// Slash Command Handler
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "⚠ Error occurred!", ephemeral: true });
  }
});

client.login(process.env.TOKEN);

