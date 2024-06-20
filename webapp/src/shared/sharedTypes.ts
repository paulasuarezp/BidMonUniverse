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

// UserCard
export interface UserCard {
    _id: string;
    card: string;
    user: string;
    username: string;
    legibleCardId: string;
    status: CardStatus;
    transactionHistory: string[];
    item: Card;
    duration?: number;
}

// TRANSACTION TYPES
// Concept of a transaction
export enum TransactionConcept {
    PurchaseByBid = "PurchaseByBid", // Purchase by bid
    PurchaseByCardPack = "PurchaseByCardPack", // Purchase by card pack
    SoldOnAuction = "SoldOnAuction", // Card sold on auction
    ForSaleOnAuction = "ForSaleOnAuction", // Card for sale on auction
    WithdrawnFromAuction = "WithdrawnFromAuction", // Card withdrawn from auction
    BidCancelledFromAuction = "BidCancelledFromAuction", // Bid cancelled because the auction was cancelled
    BidWithdrawn = "BidWithdrawn", // Bid withdrawn
    NewBid = "NewBid", // New bid
    Gift = "Gift" // Gift
}
// Transaction
export interface Transaction {
    _id: string;
    user: string;
    username: string;
    legibleCardId: string;
    userCard: string;
    concept: TransactionConcept;
    date: Date;
    price: number;
    cardId?: string;
    auctionId?: string;
    bidId?: string;
    cardPackId?: string;
    legibleCardPackId?: string;
}

// AUCTION TYPES
// Auction
export interface Auction {
    _id: string; // ID de la subasta
    card: string; // Referencia a UserCard
    legibleCardId: string; // ID legible de la tarjeta
    seller: string; // Referencia a User
    sellerUsername: string; // Nombre de usuario del vendedor
    initialPrice: number; // Precio inicial de la subasta
    currentPrice?: number; // Precio actual de la subasta
    finalPrice?: number; // Precio final de la subasta
    publicationDate: Date; // Fecha de publicación de la subasta
    duration: number; // Duración de la subasta en horas o minutos, dependiendo de la unidad usada
    estimatedEndDate: Date; // Fecha estimada de finalización de la subasta
    endDate: Date; // Fecha de finalización de la subasta
    status: AuctionStatus; // Estado de la subasta
    winner?: string; // Referencia a Bid, ganador de la subasta
    winnerUsername?: string; // Nombre de usuario del ganador
    bids: string[]; // Array de referencias a Bid
}

// Auction status
export enum AuctionStatus {
    Open = "open",
    Cancelled = "cancelled",
    Closed = "closed"
}

// BID  TYPES
// Bid status
export enum BidStatus {
    Pending = "pending",
    Winner = "winner",
    Rejected = "rejected",
    AuctionCancelled = "auctioncancelled",
    Withdrawn = "withdrawn"
}