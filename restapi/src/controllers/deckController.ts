import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';
import Deck, { IDeck } from '../models/deck';

/**
 * Obtiene todos los mazos de cartas registrados en la base de datos.
 * @param req 
 * @param res 
 * @returns lista de mazos de cartas
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
const getDecks = async (req: Request, res: Response) => {
    try {
        const decks = await Deck.find();
        res.status(200).json(decks);
    }
    catch (error: any) {
        res.status(500).json({ message: 'Se ha producido un error al obtener los mazos de cartas.' });
    }
};

/**
 * Devuelve un mazo de cartas por su ID (deckId).
 * @param req 
 * @param res 
 * @returns mazo de cartas
 * @throws 404 - Si no se encuentra el mazo de cartas
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
const getDeck = async (req: Request, res: Response) => {
    try {
        const deck = await Deck.findOne({ deckId: req.params.deckId });
        if (!deck) {
            return res.status(404).json({ message: 'Mazo de cartas no encontrado.' });
        }
        res.status(200).json(deck);
    }
    catch (error: any) {
        res.status(500).json({ message: 'Se ha producido un error al obtener el mazo de cartas.' });
    }
}

/**
 * Obtener las cartas de un mazo por su ID.
 * 
 * @param deckId - El identificador del mazo.
 * @param session - Sesión de transacción opcional.
 * @returns El mazo encontrado o null si no existe.
 * @throws Error si ocurre un error al buscar el mazo.
 */
async function getDeckByDeckId(deckId: string, session: ClientSession): Promise<IDeck | null> {
    return Deck.findOne({ deckId: deckId }).session(session).populate('cards').exec() as Promise<IDeck | null>;
}

// Exportar funciones de controlador
export {
    getDeck,
    getDeckByDeckId, getDecks
};
