const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music'),

    async execute(interaction) {
        await interaction.reply('⛔ Music stopped!');
    }
};
