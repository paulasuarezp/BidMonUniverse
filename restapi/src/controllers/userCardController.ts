import { register } from 'module';
import mongoose from 'mongoose';
import UserCard from '../models/userCard';
import { Request, Response } from 'express';
import { registerTransaction } from './transaction';
import { CardStatus, TransactionConcept } from '../models/utils/enums';
import Transaction from '../models/transaction';

// Obtener todas las cartas de un usuario
const getUserCards = async (req: Request, res: Response) => {
    try {
        const userCards = await UserCard.find({ user: req.params.userId });
        res.status(200).json(userCards);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener las cartas del usuario.' });
    }
};

// Obtener una carta de un usuario por id de carta
const getUserCard = async (req: Request, res: Response) => {
    try {
        const userCard = await UserCard.findOne({ user: req.params.userId, card: req.params.cardId });
        if (!userCard) {
            return res.status(404).json({ message: 'Carta no encontrada.' });
        }
        res.status(200).json(userCard);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener la carta del usuario.' });
    }
}

/**
 * Esta función añade una carta a la colección de cartas de un usuario si se compra directamente en la tienda.
 * 
 * @param req 
 * @param res 
 */
const addNewUserCard = async (req, res) => {
    const session = await mongoose.startSession();  // Iniciar una sesión de transacción
    session.startTransaction();  // Iniciar la transacción
    try {
        const newTransaction = new Transaction({
            user: req.body.user,
            userCard: req.body.userCard,
            concept: TransactionConcept.CardPack,
            date: new Date(),
            price: req.body.price,
            cardId: req.body.cardId,
            auctionId: req.body.auctionId,
            cardPackId: req.body.cardPackId
        });

        // Guardar la transacción dentro de la sesión de transacción
        await newTransaction.save({ session: session });

        const userCard = new UserCard({
            user: req.params.userId,
            card: req.params.cardId,
            status: CardStatus.NotForSale,
            transactionHistory: [newTransaction._id]
        });

        // Guardar la carta de usuario dentro de la misma sesión de transacción
        await userCard.save({ session: session });

        // Si todo es exitoso, realiza la transacción
        await session.commitTransaction();
        session.endSession();  // Cerrar la sesión
        res.status(200).json(userCard);
    } catch (error) {
        // Si algo falla, aborta la transacción y maneja el error
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al añadir la carta al usuario.' });
    }
}



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
const transferCard = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extraer datos necesarios del request
        const { sellerId, buyerId, userCardId, salePrice, cardId, auctionId, bidId } = req.body;

        // Eliminar la UserCard del usuario vendedor
        const transferCard = await UserCard.findOneAndDelete({ user: sellerId, card: cardId }, { session });
        if (!transferCard) {
            throw new Error("Card not found or already sold.");
        }

        // Registrar la transacción de venta
        const saleTransaction = new Transaction({
            user: sellerId,
            userCard: userCardId,
            cardId: cardId,
            concept: TransactionConcept.Sale,
            price: salePrice,
            date: new Date(),
            auctionId: auctionId,
            bidId: bidId
        });
        await saleTransaction.save({ session });

        // Registrar la transacción de compra
        const purchaseTransaction = new Transaction({
            user: buyerId,
            userCard: userCardId,
            cardId: cardId,
            concept: TransactionConcept.Bid,
            price: salePrice,
            date: new Date(),
            auctionId: auctionId,
            bidId: bidId
        });
        await purchaseTransaction.save({ session });

        // Añadir la UserCard al usuario comprador
        transferCard.user = buyerId;
        transferCard.status = CardStatus.NotForSale;
        transferCard.transactionHistory.push(saleTransaction._id);
        await transferCard.save({ session });

        // Realizar la transacción si todo fue exitoso
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: 'Card transfer successful.' });
    } catch (error) {
        // Si algo falla, abortar la transacción y manejar el error
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: error.message || 'Failed to transfer card.' });
    }
};


export {
    getUserCards,
    getUserCard,
    addNewUserCard,
    transferCard
};