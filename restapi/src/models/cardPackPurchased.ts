import {model, Schema} from 'mongoose';

const cardPackPurchasedSchema = new Schema(
    {
        cardPack:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'CardPack'
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
        price: {
            type: Number,
            required: true
        },
        cards:{
            type: [Schema.Types.ObjectId],
            ref: 'Card',
            required: true
        },
    }
)

const CardPackPurchased = model("CardPackPurchased", cardPackPurchasedSchema);
export default CardPackPurchased;