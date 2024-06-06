import { model, Schema } from 'mongoose'
import { AuctionStatus } from './utils/enums';

const auctionSchema = new Schema({
    card: { // Card that is being auctioned
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'UserCard'
    },
    seller: { // User that is selling the card
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    initialPrice: { // Initial price of the auction
        type: Number,
        required: true
    },
    publicationDate: { // Date of the publication of the auction
        type: Date,
        required: true
    },
    endDate: { // End date of the auction
        type: Date,
        required: true
    },
    status: { // Status of the auction
        type: Object.values(AuctionStatus),
        required: true
    },
    winner: { // User that won the auction
        type: Schema.Types.ObjectId,
        ref: 'Bid'
    },
    bids: { // Bids of the auction
        type: [Schema.Types.ObjectId],
        ref: 'Bid'
    },
})
const Auction = model("Auction", auctionSchema);
export default Auction;