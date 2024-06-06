
import { model, Schema } from 'mongoose'
import { CardRarity } from "./utils/enums";

const deckSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(CardRarity),
        required: true
    },
    publicationDate: {
        type: Date,
        required: true
    },
    cards: {
        type: [Schema.Types.ObjectId],
        ref: 'Card',
        required: true
    }
})

const Deck = model("Deck", deckSchema);
export default Deck;