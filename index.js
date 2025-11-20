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

// Slash commands
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
        .setDescription("Skip the current song"),
    new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the music"),
    new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the music")
].map(cmd => cmd.toJSON());

// Register slash commands on ready
client.once("clientReady", async () => {
    console.log(`Bot Logged in as ${client.user.tag}`);

    await client.application.commands.set(commands);
    console.log("Slash commands registered ✔️");
});

// Distube setup
const distube = new DisTube(client, {
    leaveOnStop: true,
    emitNewSongOnly: false,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new YtDlpPlugin()]
});

// Slash command handler
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === "play") {
        const song = interaction.options.getString("song");

        if (!interaction.member.voice.channel) {
            return interaction.reply("🎧 முதலில் Voice Channel Join ஆகவும்!");
        }

        await interaction.reply(`🎶 Searching: **${song}**`);

        distube.play(interaction.member.voice.channel, song, {
            textChannel: interaction.channel,
            member: interaction.member
        });
    }

    if (commandName === "stop") {
        distube.stop(interaction.guild.id);
        interaction.reply("⛔ Music stopped!");
    }

    if (commandName === "skip") {
        distube.skip(interaction.guild.id);
        interaction.reply("⏭ Song skipped!");
    }

    if (commandName === "pause") {
        distube.pause(interaction.guild.id);
        interaction.reply("⏸ Music paused!");
    }

    if (commandName === "resume") {
        distube.resume(interaction.guild.id);
        interaction.reply("▶ Music resumed!");
    }
});

// Distube events
distube
    .on("playSong", (queue, song) => {
        queue.textChannel.send(`🎵 Playing: **${song.name}**`);
    })
    .on("addSong", (queue, song) => {
        queue.textChannel.send(`➕ Added: **${song.name}**`);
    })
    .on("error", (channel, error) => {
        channel.send("❌ Error: " + error.message);
        console.error(error);
    });

// Login bot
client.login(token);

