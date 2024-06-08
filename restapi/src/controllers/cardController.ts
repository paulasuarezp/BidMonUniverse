import Card from '../models/card';
import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';  // Importa el tipo Session para TypeScript
import { ICard } from './types/types';
import UserCard from '../models/userCard';


/**
 * Función para obtener todas las cartas registradas en la base de datos
 * @param req 
 * @param res 
 * @returns lista de cartas
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
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

/**
 * Función para obtener una carta por su ID (cardId)
 * @param req 
 * @param res 
 * @returns carta
 * @throws 404 - Si no se encuentra la carta
 * @throws 500 - Si se produce un error de conexión con la base de datos
 */
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
 * Función para obtener una carta por su ID (mongoose.Types.ObjectId)
 * @param id id de la carta
 * @param session session de la base de datos
 * @returns carta o null si no se encuentra
 */
const getCardById = async (id: any, session: ClientSession): Promise<ICard | null> => {
    const card: any = await Card.findById(id).session(session).populate('cards').exec();
    return card as unknown as ICard | null;
  }
  
  /**
   * Función auxiliar para actualizar las referencias de las userCards en las cards
   * @returns void
   * @throws Error si no se puede actualizar la referencia
   */
  const updateCardReferences = async () => {
    try {
        // Obtener todas las UserCards
        const userCards = await UserCard.find().exec();

        // Recorrer cada UserCard y actualizar la Card correspondiente
        for (const userCard of userCards) {
            const cardId = userCard.card;
            await Card.updateOne(
                { _id: cardId },
                { $addToSet: { cards: userCard._id } } // Utiliza $addToSet para evitar duplicados
            );
        }

        console.log('All card references have been updated.');
    } catch (error) {
        console.error('Failed to update card references:', error);
    }
};

// Pipeline de agregación para comprobar las referencias de las cartas
/** 
import { MongoClient } from 'mongodb';


 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 

const agg = [
  {
    '$match': {
      '$expr': {
        '$gte': [
          {
            '$size': '$cards'
          }, 1
        ]
      }
    }
  }, {
    '$count': 'id'
  }
];

const client = await MongoClient.connect(
  ''
);
const coll = client.db('test').collection('cards');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();

console.log(result);
*/

// Exportar funciones de controlador
export {
    getCards,
    getCard,
    getCardById,
    updateCardReferences
};
