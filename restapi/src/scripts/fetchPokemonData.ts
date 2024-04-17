const axios = require('axios');

async function fetchAndStorePokemon() {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
    const pokemons = response.data.results;

    for (let pokemon of pokemons) {
      console.log(`Fetching data for ${pokemon.name}...`);
    }

    console.log('Todos los Pokémon han sido almacenados.');
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
  }
}

fetchAndStorePokemon();
