import Card from '../models/card';
import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';  // Importa el tipo Session para TypeScript
import { ICard } from './types/types';


// Obtener todas las cartas disponibles
const getCards = async (req: Request, res: Response) => {
    try {
        const cards = await Card.find();
        res.status(200).json(cards);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener las cartas.' });
    }
};

// Obtener una carta por su ID
const getCard = async (req: Request, res: Response) => {
    try {
        const
            card = await Card.findOne({ cardId: req.params.cardId });
        if (!card) {
            return res.status(404).json({ message: 'Carta no encontrada.' });
        }
        res.status(200).json(card);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener la carta.' });
    }
}

/**
 * Obtener cartas por su ID, opcionalmente dentro de una sesión de transacción.
 * 
 * @param id - El identificador de la carta.
 * @param session - Sesión de transacción opcional.
 * @returns La carta encontrada o null si no existe.
 */
const getCardById = async (id: any, session?: ClientSession): Promise<ICard | null> => {
    try {
        const query = { _id: id };
        const options = session ? { session } : {};
        const card: ICard | null = await Card.findOne(query, options);
        if (!card) {
            return null;
        }
        return card;
    }
    catch (error: any) {
        console.error('Error fetching card:', error);
        return null;
    }
}

// Exportar funciones de controlador

export {
    getCards,
    getCard,
    getCardById
};
