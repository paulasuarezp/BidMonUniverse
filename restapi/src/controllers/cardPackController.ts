import CardPack from "../models/cardpack";
import { Request, Response } from "express";
import { getDeckById } from "./deckController";
import { getCardById } from "./cardController";
import  Card  from "../models/card";


// Obtener todos los sobres de cartas disponibles
const getCardPacks = async (req: Request, res: Response) => {
    try {
        const cardPacks = await CardPack.find({ available: true });
        res.status(200).json(cardPacks);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener los paquetes de cartas.' });
    }
};

// Obtener un sobre de cartas por su ID
const getCardPack = async (req: Request, res: Response) => {
    try {
        const cardPack = await CardPack
            .findOne({ cardPackId: req.params.cardPackId, available: true });
        if (!cardPack) {
            return res.status(404).json({ message: 'Paquete de cartas no encontrado.' });
        }
        res.status(200).json(cardPack);
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Se ha producido un error al obtener el paquete de cartas.' });
    }
}




// Exportar funciones de controlador
export {
    getCardPacks,
    getCardPack
};
