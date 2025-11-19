const { Client, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.distube = new DisTube(client, {
  plugins: [new YtDlpPlugin()]
});

client.on("ready", () => {
  console.log(`Bot Online as ${client.user.tag}`);
});

client.on("messageCreate", async message => {
  if (!message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  if (cmd === "play") {
    if (!message.member.voice.channel)
      return message.reply("❌ Voice channel join பண்ணு bro!");

    client.distube.play(message.member.voice.channel, args.join(" "), {
      message
    });

    message.reply("🎶 Playing your song...");
  }

  if (cmd === "stop") {
    client.distube.stop(message);
    message.reply("⛔ Music stopped!");
  }

  if (cmd === "skip") {
    client.distube.skip(message);
    message.reply("⏭ Song skipped!");
  }
});

client.login(process.env.TOKEN);
