const Discord = require('discord.js');
const bot = new Discord.Client();
const { Logger } = require('logger');
const {discord_token, prefix} = require('./config/settings.json');
const axios = require('axios');
const help = require('../src/commands/help');

const url = 'https://pokeapi.co/api/v2/pokemon/'

const logger = new Logger({
  colors: true,
  timestamps: true
});

bot.once('ready', ()=>{
   console.log('Pokébot is Ready!');
  });


bot.on('message', (message) => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.content === `${prefix}help`) {
      help.execute(message);
    } else {

      const pokemonName = message.content.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();

      getPokemon(pokemonName).then(({ data: pokemon }) => {
        
        const pokemonNameUppercase = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        const pokemonAbilities = `\n - ${pokemon.abilities.map(({ability}) => ability.name).join('\n - ')}`;

        const pokemonFirstAppearance = `Pokémon ${pokemon.game_indices[pokemon.game_indices.length - 1].version.name}`;
        
        const pokemonTypes = `\n - ${pokemon.types.map(({type}) => type.name).join('\n - ')}`;
        
        const embedMessage = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(pokemonNameUppercase)
        .setURL('https://www.pokemon.com/us/pokedex/'+ pokemon.name)
        .setThumbnail(pokemon.sprites.front_default)
        .addBlankField()
        .addField('Information', `
          **Id :** ${pokemon.id}
          **First Appearance :** ${pokemonFirstAppearance}
          **Height :** ${pokemon.height} hectograms
          **Weight :** ${pokemon.weight} decimeters
          **Abilities :** ${pokemonAbilities}
          **Type(s) :** ${pokemonTypes}
          `)
          // **Weaknesse(s) :** ${}
          message.channel.send(embedMessage);
        }).catch(({response:{status, data}}) =>  {
          if (status === 404) {
            message.channel.send('Pokémon not found :(');
            logger.error('Error:', status, data);
          }
        });
      }
    });

function getPokemon(pokemon_name) {
  return axios.get(url + pokemon_name)
}

bot.login(discord_token);

//TODO
//evolutions name, id link,
//weaknesses