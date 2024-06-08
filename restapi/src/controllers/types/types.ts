import { Document, Types } from 'mongoose';
import { CardRarity, PokemonGym, PokemonType } from '../../models/utils/enums';

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
