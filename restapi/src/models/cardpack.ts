import {model, Schema} from 'mongoose'
import { Rarity } from './utils/enums';

const contentProbabilitySchema = new Schema({
    rarity: {
        type: String,
        enum: Rarity,
        required: true
    },
    probability: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { _id: false });

const cardPackSchema = new Schema(
    {
        name:{
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        releaseDate: {
            type: Date,
            required: true
        },
        numberOfCards: {
            type: Number,
            required: true
        },
        contentProbability: {
            type: [contentProbabilitySchema],
            required: true
        },
        availableQuantity: {
            type: Number,
            required: true
        },
        available: {
            type: Boolean,
            default: true,
            required: true
        },
    }
)

const CardPack = model("CardPack", cardPackSchema);
export default CardPack;