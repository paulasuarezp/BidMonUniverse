import Bid from '../models/bid';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import UserCard from '../models/userCard';
import { CardStatus, TransactionConcept } from '../models/utils/enums';
import Transaction from '../models/transaction';



/**
 * Esta función transfiere una carta de un usuario a otro, registrando las transacciones de venta y compra.
 *  
 * @param req
 * @param res
 * @returns
 *  
 * @throws Error
 * - Si la carta no se encuentra o ya fue vendida.
 * - Si no se puede completar la transacción.
 **/
const transferCard = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extraer datos necesarios del request
        const { sellerId, sellerUsername, buyerId, buyerUsername, userCardId, salePrice, cardId, auctionId, bidId } = req.body;

        // Actualizar la UserCard para transferirla al nuevo usuario
        const updatedCard = await UserCard.findOneAndUpdate(
            { user: sellerId, card: cardId },
            { user: buyerId, status:  CardStatus.NotForSale},  // Actualizar el usuario y el estado
            { new: true, session: session }  // Retorna el documento actualizado
        );

        if (!updatedCard) {
            throw new Error("Card not found or already transferred.");
        }

        // Registrar la transacción de venta
        const saleTransaction = new Transaction({
            user: sellerId,
            username: sellerUsername,
            userCard: userCardId,
            cardId: cardId,
            legibleCardId: req.body.legibleCardId,
            concept: TransactionConcept.Sold,
            price: salePrice,
            date: new Date(),
            auctionId: auctionId,
            bidId: bidId
        });
        await saleTransaction.save({ session });

        // Registrar la transacción de compra
        const purchaseTransaction = new Transaction({
            user: buyerId,
            username: buyerUsername,
            userCard: userCardId,
            cardId: cardId,
            legibleCardId: req.body.legibleCardId,
            concept: TransactionConcept.Bid,
            price: salePrice,
            date: new Date(),
            auctionId: auctionId,
            bidId: bidId
        });
        await purchaseTransaction.save({ session });

        // Añadir la referencia de la transacción a la carta
        updatedCard.transactionHistory.push(saleTransaction._id, purchaseTransaction._id);
        await updatedCard.save({ session });

        // Realizar la transacción si todo fue exitoso
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: 'Card transfer successful.' });
    } catch (error: any) {
        // Si algo falla, abortar la transacción y manejar el error
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: error.message || 'Failed to transfer card.' });
    }
};


export {
    transferCard
};
