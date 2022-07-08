const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'reddit',
    description: 'Fetches a random post from a given subreddit.',
    usage: '`/reddit <subreddit>`',
    permissions: '`none`',
    data: new SlashCommandBuilder()
        .setName('reddit')
        .setDescription('Returns information from the Reddit API.')
        .addStringOption(option =>
                option
                    .setName('subreddit')
                    .setDescription('The subreddit to fetch a post from.')
                    .setRequired(true)),
    async execute(interaction) {
        
        const sub = interaction.options.getString(`subreddit`);
            
        try {
            
            // Fetch post from user-defined subreddit. Solely numeric subreddits (e.g: '196') instead point to the count function and therefore don't work as intended.
            let post = await fetch(`http://meme-api.herokuapp.com/gimme/${sub}`).then(res =>
            res.json());
            

            // console.log(post);

            // If the post returns an error code, defer the user to this message.
            if(post.code) {
                return await interaction.reply({ content: post.message, ephemeral: true})
            }

            // If the post is nsfw and the channel isn't age-restricted, defer the user to this message.
            if(post.nsfw && !interaction.channel.nsfw) {
                return await interaction.reply({ content: `Due to the adult content of this post, it can only be posted to Age-Restricted Channels.\n*(Age Restriction can be applied in the* ***channel settings*** *tab)*.`, ephemeral: true })
            }

            await interaction.deferReply();

            const embed = new MessageEmbed()
            .setColor('#5866EF')
            .setAuthor({name: `u/${post.author}`, url: `https://reddit.com/user/${post.author}`})
            .setTitle(`${post.title}`)
            .setURL(post.postLink)
            .setDescription(`:arrow_up: Upvotes: ${post.ups}`)
            .setFooter({text: `source: r/${post.subreddit}`, iconURL: `https://www.redditinc.com/assets/images/site/reddit-logo.png`})
            .setImage(post.url);

            await interaction.editReply({ embeds: [embed] });  

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('request was aborted');
            }
        }
    },
};