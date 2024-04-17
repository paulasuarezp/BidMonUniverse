import axios from 'axios';
import Pokemon from '../models/pokemon';  // Asegúrate de que Pokemon sea un módulo ES6 exportado
import { findGymByPokemon } from '../models/utils/gymLeaders';


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

async function fetchAndStorePokemon() {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1');
    const pokemons = response.data.results;

    for (let { url }  of pokemons) {
        const pokemon = await axios.get(url);
        const { id, name, types, sprites, stats, height, weight } = pokemon.data;
        const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);  // endpoint species
        const encountersResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`); // endpoint encounters

       // const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/349`);  // endpoint species
       // const encountersResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/349/encounters`); // endpoint encounters



        const { flavor_text_entries, is_legendary, is_mythical } = speciesResponse.data;
        const descriptions = flavor_text_entries.filter((fte: FlavorTextEntry) => fte.language.name === "es").map((fte: FlavorTextEntry) => fte.flavor_text);

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

        // Calcula la media de max_chance
        const averageMaxChance = countMaxChance > 0 ? totalMaxChance / countMaxChance : 0;

      

        const newPokemon = new Pokemon({
          pokemonId: id,
          name: name,
          type: types[0].type.name,
          description: descriptions, 
          image: sprites.front_default,
          hp: stats.find((stat: Stat) => stat.stat.name === "hp")?.base_stat,
          attack: stats.find((stat: Stat) => stat.stat.name === "attack")?.base_stat,
          defense: stats.find((stat: Stat) => stat.stat.name === "defense")?.base_stat,
          specialAttack: stats.find((stat: Stat) => stat.stat.name === "special-attack")?.base_stat,
          specialDefense: stats.find((stat: Stat) => stat.stat.name === "special-defense")?.base_stat,
          speed: stats.find((stat: Stat) => stat.stat.name === "speed")?.base_stat,
          weight,
          height,
          is_legendary,
          is_mythical,   
          n_locationsArea,   
          n_encounters,  
          averageMaxChance,   
          gym: findGymByPokemon(name)         
      });
      
      console.log(`Fetching data for ${newPokemon}...`);
    }

    console.log('Todos los Pokémon han sido almacenados.');
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
  }
}

fetchAndStorePokemon();
