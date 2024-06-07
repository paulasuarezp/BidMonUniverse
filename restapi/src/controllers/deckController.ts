import exp from 'constants';
import Deck from '../models/deck';
import { Request, Response } from 'express';
import { ClientSession } from 'mongoose'; 

// Obtener todos los mazos de cartas disponibles
const getDecks = async (req: Request, res: Response) => {
    try {
        const decks = await Deck.find();
        res.status(200).json(decks);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener los mazos de cartas.' });
    }
};

// Obtener un mazo de cartas por su ID
const getDeck = async (req: Request, res: Response) => {
    try {
        const deck = await Deck.findOne({ deckId: req.params.deckId });
        if (!deck) {
            return res.status(404).json({ message: 'Mazo de cartas no encontrado.' });
        }
        res.status(200).json(deck);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener el mazo de cartas.' });
    }
}



/**
 * Obtener un mazo de cartas por su ID, opcionalmente dentro de una sesión de transacción.
 * 
 * @param id - El identificador del mazo.
 * @param session - Sesión de transacción opcional.
 * @returns El mazo encontrado o null si no existe.
 */
const getDeckById = async (id: string, session?: ClientSession) => {
    try {
        const query = { deckId: id };
        const options = session ? { session } : {};
        const deck = await Deck.findOne(query, options);
        if (!deck) {
            return null;
        }
        return deck;
    }
    catch (error: any) {
        console.error('Error fetching deck:', error);
        return null;
    }
}

// Exportar funciones de controlador
export {
    getDecks,
    getDeck,
    getDeckById
};
