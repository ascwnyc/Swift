const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    usage: '`/skip`',
    permissions: 'none',
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song.'),
    async execute({ client, interaction }) {
        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            return await interaction.reply({ content: 'There is no song playing.', ephemeral: true });
        }

        const currentSong = queue.current;

        queue.skip();

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#5866EF')
                    .setAuthor({name: 'Song Skipped', iconURL: client.user.avatarURL()})
                    .setDescription(`**[${currentSong.title}](${currentSong.url})** was skipped.`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        });
    },
}