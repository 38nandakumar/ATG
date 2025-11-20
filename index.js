const { Client, GatewayIntentBits, Partials, Collection, SlashCommandBuilder, Events } = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { token } = require("./config.json");

// Create client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages
    ],
    partials: [Partials.Channel]
});

// Slash commands collection
client.commands = new Collection();

// Register slash commands
const commands = [
    new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play music from YouTube")
        .addStringOption(option =>
            option.setName("song")
                .setDescription("Song name or YouTube link")
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop the music"),
    new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip current song"),
    new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause music"),
    new SlashCommandBuilder()
        .setName("resum

