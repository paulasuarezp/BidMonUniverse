import mongoose from 'mongoose';
import UserCard from '../models/userCard';
import { Request, Response } from 'express';
import { CardStatus, TransactionConcept } from '../models/utils/enums';
import Transaction from '../models/transaction';
import User from '../models/user';
import Card from '../models/card';

/**
 * Método para obtener todas las cartas de un usuario dado su username.
 * @param req request con el username del usuario
 * @param res response con la lista de cartas del usuario
 * @returns lista de cartas del usuario
 * @throws 500 - Si se produce un error al obtener las cartas del usuario
 */
const getUserCards = async (req: Request, res: Response) => {
    try {
        let username = req.params.username.toLowerCase();
        const userCards = await UserCard.find({ username: username });
        res.status(200).json(userCards);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener las cartas del usuario.' });
    }
};

const getCardsOfUser = async (req: Request, res: Response) => {
    try {
        let username = req.params.username.toLowerCase();
        const userCards = await UserCard
            .find({ username: username });

        const cards = await Card.find({ cardId: { $in: userCards.map((userCard) => userCard.legibleCardId) } });

        res.status(200).json(cards);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener las cartas del usuario.' });
    }
}
/**
 * Método para obtener una carta de un usuario dado su username y el id de la carta.
 * @param req request con el username del usuario y el id de la carta
 * @param res response con la carta del usuario
 * @returns carta del usuario
 * @throws 404 - Si no se encuentra la carta del usuario
 * @throws 500 - Si se produce un error al obtener la carta del usuario
 */
const getUserCard = async (req: Request, res: Response) => {
    try {
        let { username, cardId } = req.params;
        username = username.toLowerCase();

        const userCard = await UserCard.findOne({ username: username, legibleCardId: cardId });

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
 * Método para añadir una nueva carta a un usuario dado su username y el id de la carta. 
 * El método está pensado para ser utilizado en el caso de que un usuario reciba una carta como regalo.
 * @param req request con el id del usuario y la carta
 * @param res response con la carta añadida al usuario
 * @returns carta añadida al usuario
 * @throws 500 - Si se produce un error al añadir la carta al usuario
 */
const addNewUserCard = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();  // Iniciar una sesión de transacción
    session.startTransaction();  // Iniciar la transacción
    try {
        let { username, cardId } = req.body;
        username = username.toLowerCase();

        // Verificar que el usuario exista
        const user = await User.findOne({ username_lower: username });
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        // Verificar que la carta exista
        const card = await Card.findOne({ cardId: cardId });
        if (!card) {
            throw new Error("Carta no encontrada.");
        }

        // Crear una nueva carta de usuario
        const userCard = new UserCard({
            user: user.id,
            card: card.id,
            username: username,
            legibleCardId: cardId,
            status: CardStatus.NotForSale,
            transactionHistory: []
        });

        const newTransaction = new Transaction({
            user: user.id,
            username: username,
            userCard: req.body.userCard,
            legibleCardId: req.body.legibleCardId,
            concept: TransactionConcept.Gift,
            date: new Date(),
            price: 0,
            cardId: req.body.cardId,
            auctionId: req.body.auctionId,
            cardPackId: req.body.cardPackId,
            legibleCardPackId: req.body.legibleCardPackId
        });

        // Guardar la transacción dentro de la sesión de transacción
        await newTransaction.save({ session: session });

        userCard.transactionHistory.push(newTransaction._id);

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


export {
    getUserCards,
    getUserCard,
    addNewUserCard,
    getCardsOfUser
};