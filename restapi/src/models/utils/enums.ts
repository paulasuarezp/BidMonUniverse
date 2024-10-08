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
    Pewter = "Pewter",
    Cerulean = "Cerulean",
    Vermilion = "Vermilion",
    Celadon = "Celadon",
    Fuchsia = "Fuchsia",
    Saffron = "Saffron",
    Cinnabar = "Cinnabar",
    Viridian = "Viridian",
    Indigo = "Indigo",
    Elite = "Elite",
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
    PurchaseByBid = "PurchaseByBid", // Purchase by bid
    PurchaseByCardPack = "PurchaseByCardPack", // Purchase by card pack
    SoldOnAuction = "SoldOnAuction", // Card sold on auction
    ForSaleOnAuction = "ForSaleOnAuction", // Card for sale on auction
    WithdrawnFromAuction = "WithdrawnFromAuction", // Card withdrawn from auction
    WithdrwanFromAuctionByAdmin = "WithdrawnFromAuctionByAdmin", // Card withdrawn from auction by admin
    BidCancelledFromAuction = "BidCancelledFromAuction", // Bid cancelled because the auction was cancelled
    BidWithdrawn = "BidWithdrawn", // Bid withdrawn
    NewBid = "NewBid", // New bid
    Gift = "Gift" // Gift
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
    AuctionCancelled = "auctioncancelled",
    Withdrawn = "withdrawn"
}

// NOTIFICATION
// Notification type
export enum NotificationType {
    BidWinner = "bidwinner",
    BidRejected = "bidrejected",
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