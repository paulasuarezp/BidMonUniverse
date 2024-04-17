import {model, Schema} from 'mongoose';
import { CardStatus } from './utils/enums';

const cardPurchasedSchema = new Schema(
    {
        card:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Card'
        },
        user:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        purchaseDate: {
            type: Date,
            required: true
        },
        pruchasePrice: {
            type: Number,
            required: true
        },
        soldDate: {
            type: Date,
            required: false
        },
        soldPrice: {
            type: Number,
            required: false
        },
        status: {
            type: String,
            enum: CardStatus,
            default: CardStatus.NotForSale,
            required: true
        },
    }
)

const CardPurchased = model("CardPurchased", cardPurchasedSchema);
export default CardPurchased;