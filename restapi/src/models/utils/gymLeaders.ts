// gymLeaders.ts -> Purpose: A map that associates gym names with the Pokémon leader.
type Pokemon = {
    name: string;
    type: string;
};

type GymLeaderMap = {
    [gymName: string]: Pokemon;
};

// Object that maps gym names to the Pokémon leader
const gymLeaders: GymLeaderMap = {
    "pewter": { name: "Onix", type: "Rock" },
    "cerulean": { name: "Starmie", type: "Water" },
    "vermilion": { name: "Raichu", type: "Electric" },
    "celadon": { name: "Vileplume", type: "Grass" },
    "fuchsia": { name: "Weezing", type: "Poison" },
    "saffron": { name: "Alakazam", type: "Psychic" },
    "cinnabar": { name: "Magmar", type: "Fire" },
    "viridian": { name: "Rhydon", type: "Ground" },

};

