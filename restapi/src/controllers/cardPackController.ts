import { Request, Response } from "express";
import CardPack from "../models/cardpack";


/**
 * Función para obtener todos los sobres de cartas registrados en la base de datos
 * @param req 
 * @param res 
 * @returns lista de sobres de cartas
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
const getCardPacks = async (req: Request, res: Response) => {
    try {
        const cardPacks = await CardPack.find({ available: true }).sort({ price: 1 });
        res.status(200).json(cardPacks);
    }
    catch (error: any) {
        res.status(500).json({ message: 'Se ha producido un error al obtener los paquetes de cartas.' });
    }
};

/**
 * Función para obtener un sobre de cartas por su ID (cardPackId) y que esté disponible
 * @param req
 * @param res
 * @returns sobre de cartas
 * @throws 404 - Si no se encuentra el paquete de cartas o no está disponible
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
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
        res.status(500).json({ message: 'Se ha producido un error al obtener el paquete de cartas.' });
    }
}




// Exportar funciones de controlador
export {
    getCardPack, getCardPacks
};

