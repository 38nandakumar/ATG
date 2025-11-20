const { Client, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const distube = new DisTube(client, {
  plugins: [new YtDlpPlugin()]
});

client.on("ready", () => {
  console.log(`Bot Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.guild) return;

  const prefix = "!";

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(" ");
  const cmd = args.shift();

  if (cmd === "play") {
    if (!args[0]) return message.reply("Song URL or name kudu!");
    distube.play(message.member.voice.channel, args.join(" "), {
      textChannel: message.channel,
      member: message.member
    });
  }

  if (cmd === "stop") {
    distube.stop(message);
    message.channel.send("Music stopped!");
  }

  if (cmd === "skip") {
    distube.skip(message);
    message.channel.send("Skipped!");
  }
});

// DisTube events
distube
  .on("playSong", (queue, song) =>
    queue.textChannel.send(`Playing: **${song.name}**`)
  )
  .on("addSong", (queue, song) =>
    queue.textChannel.send(`Added: **${song.name}**`)
  );

client.login(process.env.TOKEN);

