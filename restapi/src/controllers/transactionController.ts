import Transaction from '../models/transaction';
import { Request, Response } from 'express';

const registerTransaction = async (req: Request, res: Response) => {
    try {
        const transaction = new Transaction({
            user: req.body.user,
            userCard: req.body.userCard,
            concept: req.body.concept,
            date: new Date(),
            price: req.body.price,
            cardId: req.body.cardId,
            auctionId: req.body.auctionId,
            cardPackId: req.body.cardPackId
        });

        await transaction.save();
        res.status(201).json(transaction);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al registrar la transacción.' });
    }
}

// Obtener todas las transacciones
const getTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener las transacciones.' });
    }
};

// Obtener una transacción por su ID
const getTransaction = async (req: Request, res: Response) => {
    try {
        const
            transaction = await Transaction.findOne({ transactionId: req.params.transactionId });
        if (!transaction) {
            return res.status(404
                ).json({ message: 'Transacción no encontrada.' });
        }
        res.status(200).json(transaction);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener la transacción.' });
    }
}

// Obtener transacciones por id de usuario
const getTransactionsByUserId = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find({ user: req.params.userId });
        res.status(200).json(transactions);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener las transacciones.' });
    }
}

// Obtener transacciones por id de carta
const getTransactionsByCardId = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find({ cardId: req.params.cardId });
        res.status(200).json(transactions);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener las transacciones.' });
    }
}

// Exportar funciones de controlador
export {
    getTransactions,
    getTransaction,
    getTransactionsByUserId,
    getTransactionsByCardId,
    registerTransaction
};
