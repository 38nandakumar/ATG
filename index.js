client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "play") {
        const query = interaction.options.getString("song");

        try {
            // 1. Acknowledge interaction immediately
            await interaction.deferReply();

            const channel = interaction.member.voice.channel;
            if (!channel) return interaction.editReply("❌ Please join a voice channel first!");

            await distube.play(channel, query, {
                textChannel: interaction.channel,
                member: interaction.member
            });

            // 2. Edit reply after playing starts
            await interaction.editReply(`🎶 Searching for **${query}** ...`);
            
        } catch (err) {
            console.log(err);
            interaction.editReply("❌ Error while trying to play this song.");
        }
    }
});

