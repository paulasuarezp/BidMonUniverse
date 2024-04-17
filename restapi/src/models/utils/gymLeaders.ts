// gymLeaders.ts -> Purpose: A map that associates gym names with the Pokémon leader.

import Pokemon  from "../pokemon";
import { PokemonGym } from "./enums";


type Pokemon = {
    name: string;
    type: string;
};

type GymLeaderMap = {
    [gymName: string]: Pokemon;
};

// Object that maps gym names to the Pokémon leader
export const gymLeaders: GymLeaderMap = {
    Pewter: { name: "Onix", type: "Rock" },
    Cerulean: { name: "Starmie", type: "Water" },
    Vermilion: { name: "Raichu", type: "Electric" },
    Celadon: { name: "Vileplume", type: "Grass" },
    Fuchsia: { name: "Weezing", type: "Poison" },
    Saffron: { name: "Alakazam", type: "Psychic" },
    Cinnabar: { name: "Magmar", type: "Fire" },
    Viridian: { name: "Rhydon", type: "Ground" },

};

// Function that returns the gym of a Pokémon if it is a gym leader
export function findGymByPokemon(pokemonName: string): PokemonGym {
    for (const gym in gymLeaders) {
        if (gymLeaders[gym].name.toLowerCase() === pokemonName.toLowerCase()) {
            if (gym in PokemonGym) {
                return gym as PokemonGym; 
            }
        }
    }
    return PokemonGym.None;
}
