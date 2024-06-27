import {model, Schema} from 'mongoose'
import {Document} from 'mongoose'

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

const cardPackSchema = new Schema<ICardPack>(
    {
        cardPackId: { // Unique identifier for the card pack, format "CP-XXXX"
            type: String,
            required: true
        },
        name:{ // Name of the card pack
            type: String,
            required: true
        },
        price: { // Price of the card pack
            type: Number,
            required: true
        },
        releaseDate: { // Release date of the card pack
            type: Date,
            required: true
        },
        numberOfCards: { // Number of cards in the card pack
            type: Number,
            required: true
        },
        deckId1: { // Unique identifier for the deck, format "D-XXXX"
            type: String,
            required: false
        },
        quantity1: { // Number of cards in the deck
            type: Number,
            required: false
        },
        deckId2: { // Unique identifier for the deck, format "D-XXXX"
            type: String,
            required: false
        },
        quantity2: { // Number of cards in the deck
            type: Number,
            required: false
        },
        deckId3: { // Unique identifier for the deck, format "D-XXXX"
            type: String,
            required: false
        },
        quantity3: { // Number of cards in the deck
            type: Number,
            required: false
        },
        availableQuantity: { // Number of card packs available
            type: Number,
            required: true
        },
        available: { // Whether the card pack is available
            type: Boolean,
            default: true,
            required: true
        },
    }
)

const CardPack = model("CardPack", cardPackSchema);
export default CardPack;