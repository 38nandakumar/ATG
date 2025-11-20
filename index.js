// Discord.js import
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');

// Bot instance உருவாக்கல்
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Commands collection
client.commands = new Collection();

// commands folder-ல் உள்ள commands load செய்யல்
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// interaction listener
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error occurred!', ephemeral: true });
    }
});

// ready event
client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);
});

// Bot login using GitHub Secrets
client.login(process.env.BOT_TOKEN);

