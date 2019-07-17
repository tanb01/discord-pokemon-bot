const Discord = require('discord.js');
const bot = new Discord.Client();
//const { Logger } = require('logger');
const {discord_token, prefix} = require('./config/settings.json');
const axios = require('axios');

const url = 'https://pokeapi.co/api/v2/pokemon/'


bot.once('ready', ()=>{
   console.log('Pokebot is Ready!');
  });

bot.on('message', (message) => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

    const pokemonName = message.content.slice(prefix.length).trim().split(/ +/).shift();
    
    getPokemon(pokemonName).then(({ data: pokemon }) => {
      
      const pokemonNameUppercase = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      
      const pokemonTypes = `\n - ${pokemon.types.map(({type}) => type.name).join('\n - ')}`;
      
      const embedMessage = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(pokemonNameUppercase)
      .setURL('https://www.pokemon.com/us/pokedex/'+ pokemon.name)
      .setThumbnail(pokemon.sprites.front_default)
      .addBlankField()
      .addField('Information', `
        **Id :** ${pokemon.id}
        **Height :** ${pokemon.height} hectograms
        **Weight :** ${pokemon.weight} decimeters
        **Type(s) :** ${pokemonTypes}
        `)

   message.channel.send(embedMessage);
    }).catch((error) =>  {
      if (error.response.status === 404) {
        message.channel.send('Pokemon not found :(');
        console.log('Error:', error.response.status, error.response.data);
      }
    });
    
});

function getPokemon(pokemon_name) {
  return axios.get(url + pokemon_name)
}

bot.login(discord_token);

//TODO
//evolutions name, id link,
//the first game they appeared in
//weaknesses
//abilities