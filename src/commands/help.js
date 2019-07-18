const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config/settings.json');

module.exports = {
	name: 'help',
	description: `Just use **${prefix}pokemon** where pokemon is the name of the pokemon you want to know more about`,
	aliases: ['halp'],
	usage: `${prefix}mewtwo or ${prefix}Mewtwo`,
	cooldown: 5,
	execute(message) {
    const embedMessage = new MessageEmbed()
    .setTitle('How to use the Pokébot?')
    .addField('Description ', this.description)  
    .addField('Example', this.usage)  
  message.channel.send(embedMessage);
}
};