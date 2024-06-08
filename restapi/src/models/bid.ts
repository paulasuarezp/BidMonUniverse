import { model, Schema } from 'mongoose'
import { BidStatus } from './utils/enums';

const bidSchema = new Schema({
    auction: { // Auction that the bid is for
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Auction'
    },
    user: { // User that made the bid
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    username: { // Username of the user that made the bid
        type: String,
        required: true
    },
    usercard: { // UserCard that is being bid
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'UserCard'
    },
    cardId: { // ID of the card that is being bid
        type: String,
        required: true
    },
    initDate: { // Init date of the bid
        type: Date,
        required: true
    },
    endDate: { // End date of the bid
        type: Date,
        required: true
    },
    price: { // Price of the bid
        type: Number,
        required: true
    },
    status: { // Status of the bid
        type: String,
        enum: Object.values(BidStatus),
        default: "Pending",
        required: true
    },
})
const Bid = model("Bid", bidSchema);
export default Bid;