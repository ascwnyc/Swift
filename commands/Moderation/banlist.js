const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const ban = require('./ban');

module.exports = {
    name: 'banlist',
    description: 'Displays a list of current bans in the server.',
    usage: '`/banlist`',
    permissions: '`BAN_MEMBERS`',
    data: new SlashCommandBuilder()
        .setName('banlist')
        .setDescription('Displays a list of current bans in the server.'),
    async execute(interaction) {
        const { client } = interaction;

        await interaction.guild.bans.fetch()
            .then(async bans => {
                
                if (bans.size == 0) {
                    return await interaction.reply({ content: 'The ban list is currently empty.', ephemeral: true});
                }

                let users = bans.map(user => user.user.username).join('\n');
                let reasons = bans.map(reason => reason.reason).join('\n');

                const embed = new MessageEmbed()
                    .setColor('#5866EF')
                    .setAuthor({name: `Ban List`, iconURL: client.user.avatarURL()})
                    .setDescription(`${bans.size} users are banned.`)
                    .addFields(
                        { name: 'User', value: users, inline: true },
                        { name: 'Reason', value: reasons, inline: true }
                    )
                        
                await interaction.reply({ embeds: [embed] });
            })
    },
}