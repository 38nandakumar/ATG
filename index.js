const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, Events } = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");

// Client setup
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
        .setDescription("Play a song from YouTube")
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
        .setDescription("Pause the music"),
    new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the song")
].map(cmd => cmd.toJSON());

// When bot is ready
client.once("clientReady", async () => {
    console.log(`Bot Logged in as ${client.user.tag}`);

    await client.application.commands.set(commands);
    console.log("Slash commands registered successfully ✔️");
});

// Distube setup
const distube = new DisTube(client, {
    leaveOnStop: true,
    emitNewSongOnly: false,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new YtDlpPlugin()]
});

// Command handler
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "play") {
        const song = interaction.options.getString("song");

        if (!interaction.member.voice.channel) {
            return interaction.reply("🎧 முதலில் Voice Channel Join ஆகவும்!");
        }

        await interaction.reply(`🎶 Searching for **${song}**...`);

        distube.play(interaction.member.voice.channel, song, {
            member: interaction.member,
            textChannel: interaction.channel
        });
    }

    if (interaction.commandName === "stop") {
        distube.stop(interaction.guild.id);
        interaction.reply("⛔ Music stopped!");
    }

    if (interaction.commandName === "skip") {
        distube.skip(interaction.guild.id);
        interaction.reply("⏭ Song skipped!");
    }

    if (interaction.commandName === "pause") {
        distube.pause(interaction.guild.id);
        interaction.reply("⏸ Music paused!");
    }

    if (interaction.commandName === "resume") {
        distube.resume(interaction.guild.id);
        interaction.reply("▶ Music resumed!");
    }
});

// Distube events
distube
    .on("playSong", (queue, song) => {
        queue.textChannel.send(`🎵 Now Playing: **${song.name}**`);
    })
    .on("addSong", (queue, song) => {
        queue.textChannel.send(`➕ Added: **${song.name}**`);
    })
    .on("error", (channel, err) => {
        channel.send("❌ Error: " + err.message);
        console.error(err);
    });

// LOGIN USING GITHUB SECRET TOKEN
client.login(process.env.TOKEN);

