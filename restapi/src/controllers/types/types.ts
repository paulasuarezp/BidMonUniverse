import { Document, Types } from 'mongoose';
import { AuctionStatus, BidStatus, CardRarity, PokemonGym, PokemonType } from '../../models/utils/enums';

export interface ICard extends Document {
    cardId: string;
    pokemonId: number;
    name: string;
    rarity: CardRarity;
    releaseDate: Date;
    availableQuantity: number;
    cards: Types.ObjectId[]; 
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
    gym: PokemonGym;
}

export interface IDeck extends Document {
    deckId: string;
    name: string;
    type: CardRarity;
    publicationDate: Date;
    cards: Types.ObjectId[];
}

export interface ICardPack extends Document {
    cardPackId: string;
    name: string;
    price: number;
    releaseDate: Date;
    numberOfCards: number;
    availableQuantity: number;
    available: boolean;
    deckId1?: string;
    quantity1?: number;
    deckId2?: string;
    quantity2?: number;
    deckId3?: string;
    quantity3?: number;
}

export interface IAuction extends Document {
    card: Types.ObjectId; // Referencia a UserCard
    legibleCardId: string; // ID legible de la tarjeta
    seller: Types.ObjectId; // Referencia a User
    sellerUsername: string; // Nombre de usuario del vendedor
    initialPrice: number; // Precio inicial de la subasta
    currentPrice?: number; // Precio actual de la subasta
    finalPrice?: number; // Precio final de la subasta
    publicationDate: Date; // Fecha de publicación de la subasta
    duration: number; // Duración de la subasta en horas o minutos, dependiendo de la unidad usada
    estimatedEndDate: Date; // Fecha estimada de finalización de la subasta
    endDate: Date; // Fecha de finalización de la subasta
    status: AuctionStatus; // Estado de la subasta
    winner?: Types.ObjectId; // Referencia a Bid, ganador de la subasta
    winnerUsername?: string; // Nombre de usuario del ganador
    bids: Types.ObjectId[]; // Array de referencias a Bid
}

export interface IBid extends Document {
    auction: Types.ObjectId; // Referencia al documento Auction
    user: Types.ObjectId; // Referencia al documento User
    username: string; // Nombre de usuario que realizó la puja
    usercard: Types.ObjectId; // Referencia al documento UserCard
    cardId: string; // ID de la carta que se está subastando
    initDate: Date; // Fecha en que se realizó la puja
    endDate: Date; // Fecha en que finaliza la puja
    price: number; // Precio ofrecido en la puja
    status: BidStatus; // Estado de la puja, utilizando el enum BidStatus
}