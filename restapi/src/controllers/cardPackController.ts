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

// Exportar funciones de controlador
export {
    getCardPacks
};
