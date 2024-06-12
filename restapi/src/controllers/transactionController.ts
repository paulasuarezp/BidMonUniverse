import Transaction from '../models/transaction';
import { Request, Response } from 'express';

/**
 * Función para obtener todas las transacciones registradas en la base de datos
 * @param req 
 * @param res 
 * @returns lista de transacciones
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
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

/**
 * Devuelve una transacción por su ID (mongoose.Types.ObjectId)
 * @param req 
 * @param res 
 * @returns transacción
 * @throws 404 - Si no se encuentra la transacción
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
const getTransaction = async (req: Request, res: Response) => {
    try {
        const
            transaction = await Transaction.findById(req.params.transactionId);
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

/**
 * Devuelve todas las transacciones de un usuario por su username
 * @param req 
 * @param res 
 * @returns lista de transacciones
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
const getTransactionsByUsername = async (req: Request, res: Response) => {
    try {
        let { username } = req.params;
        username = username.toLowerCase();

        const transactions = await Transaction.find({ username: username });
        res.status(200).json(transactions);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener las transacciones.' });
    }
}

/**
 * Devuelve todas las transacciones de cartas por su cardId
 * @param req 
 * @param res 
 * @returns lista de transacciones
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
const getTransactionsByCardId = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find({ legibleCardId: req.params.cardId });
        res.status(200).json(transactions);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener las transacciones.' });
    }
}

/**
 * Devuelve todas las transacciones de cartas por su cardId pertenecientes a un usuario
 * @param req
 * @param res
 * @returns
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
const getTransactionsByCardIdAndUsername = async (req: Request, res: Response) => {
    try {
        let { username, cardId } = req.params;
        username = username.toLowerCase();

        const transactions = await Transaction.find({ legibleCardId: cardId, username: username });
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
    getTransactionsByUsername,
    getTransactionsByCardId,
    getTransactionsByCardIdAndUsername
};
