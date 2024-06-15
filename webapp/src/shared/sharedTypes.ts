// USER TYPES
// User
export interface User {
    username: string;
    password: string;
    birthday: string;
    profileImg: string;
    role: AccessLevel;
    balance?: number;
}

// UserState
export interface UserState {
    username: string;
    role: AccessLevel;
    birthday: string;
    balance: number;
    profileImg: string;
    socketConnected: boolean;
}

// Enumeración de niveles de acceso
export enum AccessLevel {
    Guest = 'guest',
    Standard = 'standard',
    Admin = 'admin'
}

// CARD TYPES
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

// Rarity of a pokemon
export enum PokemonRarity {
    Common = "common",
    Rare = "rare",
    UltraRare = "ultrarare",
    Legendary = "legendary",
    Mythical = "mythical"
}

// Rarity of a card
export enum CardRarity {
    Common = "common",
    Rare = "rare",
    UltraRare = "ultrarare",
    Legendary = "legendary",
    Mythical = "mythical"
}

// Status of a card
export enum CardStatus {
    OnAuction = "onauction",
    Sold = "sold",
    NotForSale = "notforsale"
}

// Card
export interface Card {
    _id: string;
    cardId: string;
    pokemonId: number;
    name: string;
    rarity: CardRarity;
    releaseDate: Date;
    availableQuantity: number;
    cards: string[];
    pokemonType: PokemonType;
    description: string[];
    image: string;
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    weight: number;
    height: number;
    is_legendary: boolean;
    is_mythical: boolean;
    n_location_area: number;
    n_encounters: number;
    averageMaxChance: number;
    gym?: [PokemonGym];
}

// CardRarity