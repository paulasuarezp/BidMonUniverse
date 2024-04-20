import axios from 'axios';
import Pokemon from '../models/pokemon'; // Asegúrate de que Pokemon sea un módulo ES6 exportado
import { findGymByPokemon } from '../models/utils/gymLeaders';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { PokemonGym } from '../models/utils/enums';
import { writeFileSync } from 'fs';

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

interface CardData {
  pokemonId: number;
  name: string;
  type: string;
  description: string;
  image: string;
  hp: number | undefined;
  attack: number | undefined;
  defense: number | undefined;
  specialAttack: number | undefined;
  specialDefense: number | undefined;
  speed: number | undefined;
  weight: number;
  height: number;
  is_legendary: boolean;
  is_mythical: boolean;
  n_locationsArea: number;
  n_encounters: number;
  averageMaxChance: number;
  gym: PokemonGym;
}


async function fetchAndStorePokemon() {
  const csvWriter = createCsvWriter({
    path: 'data/cards_data.csv',
    header: [
      { id: 'pokemonId', title: 'ID' },
      { id: 'name', title: 'Name' },
      { id: 'type', title: 'Type' },
      { id: 'description', title: 'Description' },
      { id: 'image', title: 'Image URL' },
      { id: 'hp', title: 'HP' },
      { id: 'attack', title: 'Attack' },
      { id: 'defense', title: 'Defense' },
      { id: 'specialAttack', title: 'Special Attack' },
      { id: 'specialDefense', title: 'Special Defense' },
      { id: 'speed', title: 'Speed' },
      { id: 'weight', title: 'Weight' },
      { id: 'height', title: 'Height' },
      { id: 'is_legendary', title: 'Legendary' },
      { id: 'is_mythical', title: 'Mythical' },
      { id: 'n_locationsArea', title: 'Locations Area Count' },
      { id: 'n_encounters', title: 'Encounters Count' },
      { id: 'averageMaxChance', title: 'Average Max Chance' },
      { id: 'gym', title: 'Gym' },
    ],
    fieldDelimiter: ';',
    //append: false,  // set this to false if it's a new file or true to append
  });

  

  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1');
    const pokemons = response.data.results;
    const records: CardData[] = [];

    let counter = 0;

    for (let { url } of pokemons) {
      const pokemon = await axios.get(url);
      const { id, name, types, sprites, stats, height, weight } = pokemon.data;
      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
      const encountersResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);

      const { flavor_text_entries, is_legendary, is_mythical } = speciesResponse.data;
      const descriptions = flavor_text_entries.filter((fte: FlavorTextEntry) => fte.language.name === 'es')
                                                  .map((fte: FlavorTextEntry) => fte.flavor_text.replace(/\n/g, ' '));  // Reemplaza los saltos de línea con espacios

      const dreamWorldImage = sprites.other.dream_world.front_default;
      const uniqueLocations = new Set(encountersResponse.data.map((encounter: Encounter) => encounter.location_area.name));
      const n_locationsArea = uniqueLocations.size;
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

      const record:CardData = {

        pokemonId: id,
        name,
        type: types[0].type.name,
        description: descriptions.join('@NEWDESCRIPTION@'), // join descriptions to fit in one CSV cell
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
        n_locationsArea,
        n_encounters,
        averageMaxChance,
        gym: findGymByPokemon(name)
      };

      records.push(record);
      console.log(`Fetching data for ${name}...`);
    }

    await csvWriter.writeRecords(records);
    console.log('Todos los Pokémon han sido almacenados en el CSV.');
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
  }
}

fetchAndStorePokemon();
