import axios from 'axios';
import { findGymByPokemon } from '../models/utils/gymLeaders';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { CardRarity, PokemonGym, PokemonRarity, PokemonType } from '../models/utils/enums';
import { random } from 'lodash';
import { get } from 'http';

interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string };
}

interface Encounter {
  location_area: { name: string };
}

interface Stat {
  base_stat: number;
  stat: { name: string };
}

export interface CardData {
  cardId: String, // Del tipo C000, C001, C002 ... CNNN
  pokemonId: Number, 
  name: String, // Nombre del pokemon
  rarity: CardRarity, // Rareza de la carta
  releaseDate: Date,
  availableQuantity: Number,
  cards: String,
  pokemonType: PokemonType, 
  description: String, // Se obtiene del endpoint pokemon-species/id -> flavor_text
  image: String, // URL a la imagen del pokemon
  hp: Number, 
  attack: Number, 
  defense: Number, 
  specialAttack: Number, 
  specialDefense: Number, 
  speed: Number, 
  weight: Number, 
  height: Number, 
  is_legendary: Boolean, 
  is_mythical: Boolean,
  n_location_area: Number, // Contador de las location_area que aparecen en el endpoint https://pokeapi.co/api/v2/pokemon/id/encounters
  n_encounters: Number, // Contador de los encounter_details que aparecen en el endpoint https://pokeapi.co/api/v2/pokemon/id/encounters
  averageMaxChance: Number, // Media de la probabilidad de capturar a un pokemon https://pokeapi.co/api/v2/pokemon/id/encounters
  pokemonRarity: String, // Rareza del Pokemon
  gym: PokemonGym, // Campo opcional, solo tendrá valor si el Pokemon de la carta es el favorito de algún gimnasio
  
}



async function fetchAndStorePokemon() {
  const csvWriter = createCsvWriter({
    path: 'data/cards_data.csv',
    header: [
      { id: 'cardId', title: 'cardId' }, // Format: "c-<pokemonId>-n"
      { id: 'pokemonId', title: 'pokemonId' },
      { id: 'name', title: 'name' },
      { id: 'rarity', title: 'rarity' },
      { id: 'releaseDate', title: 'releaseDate' },
      { id: 'availableQuantity', title: 'availableQuantity' },
      { id: 'cards', title: 'cards' },
      { id: 'pokemonType', title: 'pokemonType' },
      { id: 'description', title: 'description' },
      { id: 'image', title: 'image' },
      { id: 'hp', title: 'hp' },
      { id: 'attack', title: 'attack' },
      { id: 'defense', title: 'defense' },
      { id: 'speed', title: 'speed' },
      { id: 'weight', title: 'weight' },
      { id: 'height', title: 'height' },
      { id: 'is_legendary', title: 'is_legendary' },
      { id: 'is_mythical', title: 'is_mythical' },
      { id: 'n_location_area', title: 'n_location_area' },
      { id: 'n_encounters', title: 'n_encounters' },
      { id: 'averageMaxChance', title: 'averageMaxChance' },
      { id: 'pokemonRarity', title: 'pokemonRarity'},
      { id: 'gym', title: 'gym' },
    ],
    fieldDelimiter: ';',
    //append: false,  // set this to false if it's a new file or true to append
  });


  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    const pokemons = response.data.results;
    const records: CardData[] = [];

    let counter = 0;

    for (let { url } of pokemons) {
      const pokemon = await axios.get(url);
      const { id, name, types, sprites, stats, height, weight } = pokemon.data;
      const pokemonName = name.toLowerCase();
      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
      const encountersResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);

      const { flavor_text_entries, is_legendary, is_mythical } = speciesResponse.data;
      const descriptions = flavor_text_entries.filter((fte: FlavorTextEntry) => fte.language.name === 'es')
                                                  .map((fte: FlavorTextEntry) => fte.flavor_text.replace(/\n/g, ' '));  // Reemplaza los saltos de línea con espacios

      const dreamWorldImage = sprites.other.dream_world.front_default;
      const uniqueLocations = new Set(encountersResponse.data.map((encounter: Encounter) => encounter.location_area.name));
      const n_location_area = uniqueLocations.size;
      let n_encounters = 0;
      let totalMaxChance = 0;
      let countMaxChance = 0;

      encountersResponse.data.forEach((encounter: any) => {
        encounter.version_details.forEach((versionDetail: any) => {
          if (versionDetail.encounter_details && versionDetail.encounter_details.length > 0) {
            n_encounters++;
          }
          totalMaxChance += versionDetail.max_chance;
          countMaxChance++;
        });
      });

      const averageMaxChance = countMaxChance > 0 ? totalMaxChance / countMaxChance : 0;

      const pokemonRarity = getPokemonRarity(n_encounters, n_location_area, averageMaxChance, is_legendary, is_mythical);
      const card: CardData = {
        cardId: `c-${id}-${counter++}`,
        pokemonId: id,
        name: pokemonName,
        rarity: getCardRarity(),
        releaseDate: new Date(),
        availableQuantity: 100,
        cards: '',
        pokemonType: types[0].type.name as PokemonType,
        description: descriptions.join('@NEWDESCRIPTION@'), 
        image: dreamWorldImage,
        hp: stats.find((stat: Stat) => stat.stat.name === 'hp')?.base_stat,
        attack: stats.find((stat: Stat) => stat.stat.name === 'attack')?.base_stat,
        defense: stats.find((stat: Stat) => stat.stat.name === 'defense')?.base_stat,
        specialAttack: stats.find((stat: Stat) => stat.stat.name === 'special-attack')?.base_stat,
        specialDefense: stats.find((stat: Stat) => stat.stat.name === 'special-defense')?.base_stat,
        speed: stats.find((stat: Stat) => stat.stat.name === 'speed')?.base_stat,
        weight,
        height,
        is_legendary,
        is_mythical,
        n_location_area: n_location_area,
        n_encounters,
        averageMaxChance,
        pokemonRarity: pokemonRarity,
        gym: findGymByPokemon(name)
      };

      records.push(card);
      console.log(`Fetching data for ${name}...`);
    }

    await csvWriter.writeRecords(records);
    console.log('Todos los Pokémon han sido almacenados en el CSV.');
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
  }
}

function getPokemonRarity(n_encounters: number, n_location_area: number, averageMaxChance: number, is_legendary:boolean, is_mythical:boolean): string {
  if (is_legendary) {
    return PokemonRarity.Legendary;
  } else if (is_mythical) {
    return PokemonRarity.Mythical;
  }
  return calculatePokemonRarity(n_encounters, n_location_area, averageMaxChance);
}

// Función para calcular la rareza de un Pokémon
function calculatePokemonRarity(n_encounters: number, n_location_area: number, averageMaxChance: number): string {
  // Criterios arbitrarios para determinar la rareza
  if (n_encounters < 10 && n_location_area <= 2 && averageMaxChance < 30) {
    return PokemonRarity.UltraRare;
  } else if (n_encounters < 20 && n_location_area <= 5 && averageMaxChance < 50) {
    return PokemonRarity.Rare;
  } else {
    return PokemonRarity.Common;
  }
}

/**
 *  randomNumber < 50: Si el número aleatorio es menor que 50 retorna 'Common'.
    randomNumber < 75: Si el número está entre 50 y 74 (25% de los casos), retorna 'Rare'.
    randomNumber < 95: Si el número está entre 75 y 94 (20% de los casos), retorna 'Ultra Rare'.
    randomNumber >= 95: Si el número es 95 o mayor (5% de los casos), retorna 'Legendary'.
 * @returns 
 */
function getCardRarity(): CardRarity {
  const randomNumber = random(0, 100);  // Generamos un número entre 0 y 100
  if (randomNumber < 50) {
    return CardRarity.Common;  
  } else if (randomNumber < 75) {
    return CardRarity.Rare;  
  } else if (randomNumber < 95) {
    return CardRarity.UltraRare;  
  } else {
    return CardRarity.Legendary; 
  }
}

fetchAndStorePokemon();
