import { model, Schema } from 'mongoose'
import { AuctionStatus } from './utils/enums';
import { Document, Types } from 'mongoose';

export interface IAuction extends Document {
    card: Types.ObjectId; // Referencia a UserCard
    legibleCardId: string; // ID legible de la tarjeta
    seller: Types.ObjectId; // Referencia a User
    sellerUsername: string; // Nombre de usuario del vendedor
    initialPrice: number; // Precio inicial de la subasta
    currentPrice?: number; // Precio actual de la subasta
    finalPrice?: number; // Precio final de la subasta
    publicationDate: Date; // Fecha de publicación de la subasta
    duration: number; // Duración de la subasta en horas o minutos, dependiendo de la unidad usada
    estimatedEndDate: Date; // Fecha estimada de finalización de la subasta
    endDate: Date; // Fecha de finalización de la subasta
    status: AuctionStatus; // Estado de la subasta
    winner?: Types.ObjectId; // Referencia a Bid, ganador de la subasta
    winnerUsername?: string; // Nombre de usuario del ganador
    bids: Types.ObjectId[]; // Array de referencias a Bid
}

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