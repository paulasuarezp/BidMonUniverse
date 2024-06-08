import { Request, Response } from "express";
import CardPack from "../models/cardpack";
import { getDeckById } from "./deckController";
import { getCardById } from "./cardController";
import  Card  from "../models/card";
import Transaction from "../models/transaction";
import UserCard from "../models/userCard";
import mongoose from "mongoose";
import { CardStatus, TransactionConcept } from "../models/utils/enums";
import { IDeck, ICard} from "./types/types";
import { ClientSession } from "mongoose";


const purchaseCardPack = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { userId, cardPackId, price } = req.body;

        const cardPack = await CardPack.findById(cardPackId).session(session);
        if (!cardPack) {
            throw new Error("El paquete de cartas no existe.");
        }

        let allGeneratedCards: ICard[] = [];  // Asegúrate de que el tipo es consistente y adecuado

        // Generar cartas para cada mazo definido en el paquete de cartas
        for (const [index, deckId] of [cardPack.deckId1, cardPack.deckId2, cardPack.deckId3].entries()) {
            const quantity = cardPack['quantity' + (index + 1)];
            if (deckId && quantity) {
                const cards = await generateCards(deckId, quantity, session);
                allGeneratedCards = allGeneratedCards.concat(cards);
            }
        }

        // Crear y guardar transacciones para cada carta generada
        for (const card of allGeneratedCards) {

            const newTransaction = new Transaction({
                user: userId,
                concept: TransactionConcept.CardPack,
                date: new Date(),
                price: price,
                cardId: card._id, 
                cardPackId: cardPackId
            });

            await newTransaction.save({ session });

            const newUserCard = new UserCard({
                user: userId,
                card: card._id,
                status: CardStatus.NotForSale,
                transactionHistory: [newTransaction._id]
            });

            await newUserCard.save({ session });
        }

        await session.commitTransaction();

        res.status(200).json({ message: "Las cartas se han comprado correctamente." , cards: allGeneratedCards});

    } catch (error) {
        
        console.error("Se ha producido un error al comprar el paquete de cartas:", error);
        await session.abortTransaction();
        res.status(500).json({ message: error.message || "Se ha producido un error al comprar el paquete de cartas." });

    } finally {
        session.endSession();
    }
};

/**
 * Función para generar cartas aleatorias de un mazo.
 * 
 * @param deckId Identificador del mazo de donde se sacarán las cartas.
 * @param quantity Cantidad de cartas a generar.
 * @param session Sesión de transacción de Mongoose.
 * @returns Un array de objetos Card.
 */
async function generateCards(deckId: string, quantity: number, session: ClientSession): Promise<ICard[]> {
    let cards: ICard[] = [];
    const deck: IDeck | null = await getDeckById(deckId, session);
    if (!deck) {
        return cards; // Retorna un array vacío si el mazo no tiene cartas.
    }

    let cardsIds = deck.cards.map(card => card._id);

    while (cards.length < quantity) {
        const randomIndex = Math.floor(Math.random() * cardsIds.length);
        const card = cardsIds.splice(randomIndex, 1)[0]; 

        let generatedCard: ICard | null = await getCardById(card._id, session);
      
        if (!generatedCard || cards.some(c => c.cardId === generatedCard.cardId) || generatedCard.availableQuantity <= 0){
            continue; 
        }

        generatedCard.availableQuantity --;
        await generatedCard.save({ session });

        cards.push(generatedCard);
    }

    return cards;
}
