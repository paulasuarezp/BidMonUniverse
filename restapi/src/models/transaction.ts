import { model, Schema } from 'mongoose'
import { TransactionConcept } from './utils/enums';

const transactionSchema = new Schema({
    user: { // User that made the transaction
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    username: {
        type: String,
        required: true,
    },
    legibleCardId: {
        type: String,
        required: true,
    },
    userCard: { // User card that was purchased or sold
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'UserCard'
    },
    concept: {
        type: Object.values(TransactionConcept),
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cardId: {
        type: Schema.Types.ObjectId,
        ref: 'Card',
    },
    auctionId: {
        type: Schema.Types.ObjectId,
        ref: 'Auction',
    },
    bidId : {
        type: Schema.Types.ObjectId,
        ref: 'Bid',
    },
    cardPackId: {
        type: Schema.Types.ObjectId,
        ref: 'CardPack',
    },
    legibleCardPackId: {
        type: String,
        required: false,
    }
})

const Transaction = model("Transaction", transactionSchema);
export default Transaction;