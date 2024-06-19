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

/**
 * Método para obtener una carta de un usuario dado el id de la carta.
 * @param req request con el username del usuario y el id de la carta
 * @param res response con la carta del usuario
 * @returns carta del usuario
 * @throws 404 - Si no se encuentra la carta del usuario
 * @throws 500 - Si se produce un error al obtener la carta del usuario
 */
const getUserCard = async (req: Request, res: Response) => {
    try {
        let { id } = req.params;

        const userCard = await UserCard.findOne({ _id: id });

        console.log(userCard);
        if (!userCard)
            return res.status(404).json({ message: 'Carta de usuario no encontrada.' });

        res.status(200).json(userCard);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener la carta del usuario.' });
    }
}



export {
    getUserCards,
    getUserCard
};