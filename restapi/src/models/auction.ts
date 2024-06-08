import { model, Schema } from 'mongoose'
import { AuctionStatus } from './utils/enums';

const auctionSchema = new Schema({
    card: { // Card that is being auctioned
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'UserCard'
    },
    legibleCardId: { // Legible card ID
        type: String,
        required: true
    },
    seller: { // User that is selling the card
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    sellerUsername: { // Username of the seller
        type: String,
        required: true
    },
    initialPrice: { // Initial price of the auction
        type: Number,
        required: true
    },
    currentPrice: { // Current price of the auction
        type: Number,
    },
    finalPrice: { // Final price of the auction
        type: Number
    },
    publicationDate: { // Date of the publication of the auction
        type: Date,
        required: true
    },
    duration : { // Duration of the auction
        type: Number,
        required: true
    },
    estimatedEndDate: { // Estimated end date of the auction
        type: Date,
        required: true
    },
    endDate: { // End date of the auction
        type: Date,
        required: true
    },
    status: { // Status of the auction
        type: String,
        enum: Object.values(AuctionStatus),
        required: true
    },
    winner: { // User that won the auction
        type: Schema.Types.ObjectId,
        ref: 'Bid'
    },
    winnerUsername: { // Username of the winner
        type: String
    },
    bids: { // Bids of the auction
        type: [Schema.Types.ObjectId],
        ref: 'Bid'
    },
})
const Auction = model("Auction", auctionSchema);
export default Auction;