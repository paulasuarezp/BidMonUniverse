import { Request, Response } from 'express';
import Transaction from '../models/transaction';

/**
 * Función para obtener todas las transacciones registradas en la base de datos
 * @param req 
 * @param res 
 * @returns lista de transacciones
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
const getTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.status(200).json(transactions);
    }
    catch (error: any) {
        res.status(500).json({ message: 'Se ha producido un error al obtener las transacciones.' });
    }
};

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

        const transactions = await Transaction.find({ username: username }).sort({ date: -1 });
        res.status(200).json(transactions);
    }
    catch (error: any) {
        res.status(500).json({ message: 'Se ha producido un error al obtener las transacciones.' });
    }
}

/**
 * Devuelve todas las transacciones de cartas para el id (ObjectId) de la userCard de un usuario
 * @param req 
 * @param res 
 * @returns lista de transacciones
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
const getTransactionsByUserCardId = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find({ userCard: req.params.userCardId }).sort({ date: -1 });
        res.status(200).json(transactions);
    }
    catch (error: any) {
        res.status(500).json({ message: 'Se ha producido un error al obtener las transacciones.' });
    }
}


// Exportar funciones de controlador
export {
    getTransactions, getTransactionsByUserCardId, getTransactionsByUsername
};

