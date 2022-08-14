const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    name: 'play',
    description: 'Plays a song. The search query can either be in the form of keywords or a url.',
    usage: '`/play <song>`',
    permissions: 'none',
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song.')
        .addStringOption(option =>
            option
                .setName('song')
                .setDescription('The song to search for.')
                .setRequired(true)
        ),
    async execute({ client, interaction }) {
        await interaction.deferReply();
        
        if (!interaction.member.voice.channel) {
            return await interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
        }

        const queue = await client.player.createQueue(interaction.guild);

        if (!queue.connection) {
            await queue.connect(interaction.member.voice.channel);
        }

        let embed = new EmbedBuilder();

        embed
            .setColor('#5866EF')
            .setAuthor({name: 'Song Added', iconURL: client.user.avatarURL()});

        let query = interaction.options.getString('song');

        const result = await client.player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        });

        if (result.tracks.length === 0) {
            return await interaction.reply({ content: 'No results found.', ephemeral: true });
        }

        const song = result.tracks[0];
        await queue.addTrack(song);

        embed
            .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}` });

        if (!queue.playing) {
            await queue.play();
        }

        return await interaction.editReply({ embeds: [embed] });
    },
}
