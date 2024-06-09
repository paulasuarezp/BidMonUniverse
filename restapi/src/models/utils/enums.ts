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

// Rarity of a pokemon
export enum PokemonRarity {
    Common = "common",
    Rare = "rare",
    UltraRare = "ultrarare",
    Legendary = "legendary",
    Mythical = "mythical"
}



// CARD
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

// TRANSACTION
// Transaction concept
export enum TransactionConcept {
    CardPack = "PurchaseByCardPack",
    Bid = "PurchaseByBid",
    Sold = "SoldOnAuction",
    ForSale = "ForSaleOnAuction",
    Withdrawn = "WithdrawnFromAuction",
    Gift = "Gift",
}

// AUCTION
// Auction status
export enum AuctionStatus {
    Open = "open",
    Cancelled = "cancelled",
    Closed = "closed"
}

// BID
// Bid status
export enum BidStatus {
    Pending = "pending",
    Winner = "winner",
    Rejected = "rejected",
    Withdrawn = "withdrawn"
}

// NOTIFICATION
// Notification type
export enum NotificationType {
    BidWinner = "bidwinner",
    AuctionCancelled = "auctioncancelled",
    CardSold = "auctioncardsold",
    CardNotSold = "auctioncardnotsold",
    CardGifted = "cardgifted",
    System = "system"
}

// Notification importance
export enum NotificationImportance {
    Low = "low",
    Medium = "medium",
    High = "high"
}