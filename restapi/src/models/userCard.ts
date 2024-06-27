import {model, Schema} from 'mongoose';
import { CardStatus } from './utils/enums';

const userCardSchema = new Schema(
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
        username:{
            type: String,
            required: true
        },
        legibleCardId:{
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: CardStatus,
            default: CardStatus.NotForSale,
            required: true
        },
        transactionHistory: {
            type: [Schema.Types.ObjectId],
            required: true,
            ref: 'Transaction'
        }
    }
)

const UserCard = model("UserCard", userCardSchema);
export default UserCard;