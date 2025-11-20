const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages
  ],
});

// Slash command collection
client.commands = new Collection();

// Load commands from commands folder
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// DisTube Setup
client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnStop: false,
  leaveOnFinish: true,
  plugins: [
    new YtDlpPlugin()
  ],
});

// Ready Event
client.once("ready", () => {
  console.log(`🚀 Logged in as ${client.user.tag}`);
});

// Interaction Handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.log(err);
    await interaction.reply({ content: "❌ Error executing command!", ephemeral: true });
  }
});

// Login
client.login(process.env.TOKEN);

