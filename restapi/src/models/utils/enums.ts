// enums.ts -> Purpose: Enums for the different types of Pokémon, gyms, card rarities, and card statuses.


// POKEMON
// Type of a pokemon
export enum PokemonType {
    Water = "water",
    Bug = "bug",
    Dragon = "dragon",
    Electric = "electric",
    Ghost = "ghost",
    Fire = "fire",
    Ice = "ice",
    Fighting = "fighting",
    Normal = "normal",
    Grass = "grass",
    Psychic = "psychic",
    Rock = "rock",
    Ground = "ground",
    Poison = "poison",
    Fairy = "fairy",
    Steel = "steel",
    Dark = "dark",
    Flying = "flying"
}

// Gym of a pokemon (it can be none if the pokemon is not the the gym leader)
export enum PokemonGym {
    Pewter = "pewter",
    Cerulean = "cerulean",
    Vermilion = "vermilion",
    Celadon = "celadon",
    Fuchsia = "fuchsia",
    Saffron = "saffron",
    Cinnabar = "cinnabar",
    Viridian = "viridian",
    Indigo = "indigo",
    Elite = "elite",
    None = "none"
}



// CARD
// Rarity of a card
export enum Rarity {
    Common = "common",
    Rare = "rare",
    UltraRare = "ultrarare",
    Legendary = "legendary",
    Mythical = "mythical"
}

// Status of a card
export enum CardStatus {
    Sold = "sold",
    OnBid = "onbid",
    NotForSale = "notforsale"
}
