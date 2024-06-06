import {model, Schema} from 'mongoose'

const contentSchema = new Schema({
    deck: {
        type: Schema.Types.ObjectId,
        ref: 'Deck',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { _id: false });

const cardPackSchema = new Schema(
    {
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
        content: { // Specific type of card that you want to ensure is present in the card pack (e.g. 1 rare, 2 uncommon, 3 common) (optional)
            type: [contentSchema],
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