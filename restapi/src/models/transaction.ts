import { model, Schema } from 'mongoose'
import { TransactionConcept } from './utils/enums';

const transactionSchema = new Schema({
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
    auctionId: {
        type: Schema.Types.ObjectId,
        ref: 'Auction',
    },
    cardPackId: {
        type: Schema.Types.ObjectId,
        ref: 'CardPack',
    },
})

const Transaction = model("Transaction", transactionSchema);
export default Transaction;