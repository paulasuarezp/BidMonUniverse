import { Request, Response } from "express";
import CardPack from "../models/cardpack";
import { getDeckById } from "./deckController";
import { getCardById } from "./cardController";
import  User from "../models/user";
import Transaction from "../models/transaction";
import UserCard from "../models/userCard";
import mongoose from "mongoose";
import { CardStatus, TransactionConcept } from "../models/utils/enums";
import { IDeck, ICard, ICardPack} from "./types/types";
import { ClientSession } from "mongoose";

/**
 * Función que permite comprar un paquete de cartas.
 * 1. Se obtiene el paquete de cartas a comprar.
 * 2. Se generan cartas aleatorias para cada mazo definido en el paquete.
 * 3. Se crean y guardan transacciones para cada carta generada.
 * 4. Se crean y guardan registros de cartas de usuario para cada carta generada.
 *  
 * @param req 
 * @param res 
 */

const purchaseCardPack = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { userId, cardPackId } = req.body;

        const cardPack = await CardPack.findById(cardPackId).session(session);
        if (!cardPack) {
            throw new Error("El paquete de cartas no existe.");
        }

        // Verificar que haya disponibilidad del paquete de cartas
        if (cardPack.availableQuantity <= 0) {
            throw new Error("El paquete de cartas está agotado.");
        }


        // Verificar que el usuario tenga suficiente saldo para comprar el paquete
        const price = cardPack.price;
        let user = await User.findOne({ username: userId }).session(session);
        if (!user) {
            throw new Error("El usuario no existe.");
        }
        if (user && user.balance && user.balance < price) {
            throw new Error("Saldo insuficiente para comprar el paquete de cartas.");
        } else if (!user.balance) {
            throw new Error("El usuario no tiene saldo.");
        } else {
            // Actualizar el saldo del usuario
            user.balance -= price;
            await user.save({ session });
        }

        // Array para almacenar todas las cartas generadas
        let allGeneratedCards: ICard[] = []; 

        // Generar cartas para cada mazo definido en el paquete de cartas
        for (const [index, deckId] of [cardPack.deckId1, cardPack.deckId2, cardPack.deckId3].entries()) {
            const quantityKey = `quantity${index + 1}` as keyof ICardPack;
            const quantity = cardPack[quantityKey];
            if (deckId && quantity) {
                const cards = await generateCards(deckId, quantity, session);
                allGeneratedCards = allGeneratedCards.concat(cards);
            }
        }

        // Comprobar que se ha generado el número de cartas esperado
        if (allGeneratedCards.length !== cardPack.numberOfCards) {
            throw new Error("No se han podido generar todas las cartas del paquete.");
        }

        // Actualizar la cantidad disponible del paquete de cartas
        cardPack.availableQuantity--;

        if (cardPack.availableQuantity <= 0) {
            cardPack.available = false;
        }

        await cardPack.save({ session });

        

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

    } catch (error: any) {

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

    while (cards.length < quantity && cardsIds.length > 0) {
        const randomIndex = Math.floor(Math.random() * cardsIds.length);
        const cardId = cardsIds.splice(randomIndex, 1)[0]; 

        let generatedCard: ICard | null = await getCardById(cardId, session);

        if (!generatedCard) {
            continue; // Si es null, salta al próximo ciclo del bucle.
        } else {
            if (generatedCard.cardId && cards.some(c => c.cardId === generatedCard.cardId)) {
                continue;
            }
            else if (generatedCard.availableQuantity <= 0) {
                continue;
            } else {
                generatedCard.availableQuantity--;
                await generatedCard.save({ session });
                cards.push(generatedCard);
            }
        }
        
    }

    return cards;
}


export {
    purchaseCardPack   
};