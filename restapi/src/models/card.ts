import { model, Schema } from 'mongoose'

const cardSchema = new Schema(
    {
        pokemon:{
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'Pokemon'  
        },
        name:{
            type: String,
            unique: true,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        rarity: {
            type: String,
            enum: ["common", "rare", "ultrarare", "legendary", "mythical"],
            required: true
        },
        probability: {
            type: Number,
            required: true
        },
        releaseDate: {
            type: Date,
            required: true
        },
        availableQuantity: {
            type: Number,
            required: true
        },

    }
)

const Card = model("Card", cardSchema);

export default Card;