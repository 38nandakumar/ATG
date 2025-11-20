// தேவையான Discord.js import செய்யல்
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config(); 
்
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


client.commands = new Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'பிழை ஏற்பட்டது!', ephemeral: true });
    }
});


client.once('ready', () => {
    console.log(`${client.user.tag} ஆனது online ஆனது!`);
});


client.login(process.env.MTQyNjI0NzA0MjczMjEzMDQ2Ng.GquWbk.1GshRDRw0Bt-WTKeECq1BvxBxa5SqosP3qKx5k); 

