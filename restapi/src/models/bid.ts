import { model, Schema } from 'mongoose'
import { BidStatus } from './utils/enums';
import { Document, Types } from 'mongoose';

export interface IBid extends Document {
    auction: Types.ObjectId; // Referencia al documento Auction
    user: Types.ObjectId; // Referencia al documento User
    username: string; // Nombre de usuario que realizó la puja
    usercard: Types.ObjectId; // Referencia al documento UserCard
    legibleCardId: string; // ID de la carta que se está subastando (cardId)
    initDate: Date; // Fecha en que se realizó la puja
    estimatedDate: Date; // Fecha estimada en que finaliza la puja
    endDate: Date; // Fecha en que finaliza la puja
    price: number; // Precio ofrecido en la puja
    status: BidStatus; // Estado de la puja, utilizando el enum BidStatus
}

const bidSchema = new Schema<IBid>({
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
    legibleCardId: { // ID of the card that is being bid (cardId)
        type: String,
        required: true
    },
    initDate: { // Init date of the bid
        type: Date,
        required: true
    },
    estimatedDate: { // Estimated date of the bid
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
        default: BidStatus.Pending,
        required: true
    }
})
const Bid = model("Bid", bidSchema);
export default Bid;