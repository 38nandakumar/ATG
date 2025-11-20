const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Song name or URL')
                .setRequired(true)
        ),

    async execute(interaction) {
        const song = interaction.options.getString('song');
        await interaction.reply(`🎵 Playing: ${song}`);
    }
};
