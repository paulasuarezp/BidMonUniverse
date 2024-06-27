import { Request, Response } from "express";
import mongoose from "mongoose";
import Card, { ICard } from "../models/card";
import CardPack, { ICardPack } from "../models/cardpack";
import { IDeck } from "../models/deck";
import Transaction from "../models/transaction";
import User from "../models/user";
import UserCard from "../models/userCard";
import { CardStatus, TransactionConcept } from "../models/utils/enums";
import { getDeckByDeckId } from "./deckController";

/**
 * Función que permite comprar un paquete de cartas.
 * 
 * 1. Se obtiene el paquete de cartas a comprar.
 * 2. Se verifica que haya disponibilidad del paquete de cartas.
 * 3. Se verifica que el usuario tenga suficiente saldo para comprar el paquete.
 * 4. Se generan las cartas del paquete, actualizando la cantidad disponible de cada carta.
 * 5. Se actualiza la cantidad disponible del paquete de cartas.
 * 6. Se actualiza el saldo del usuario.
 * 7. Se crean y guardan las transacciones para cada carta generada.
 * 8. Se añade la referencia de la carta del usuario en la carta genérica.
 * 9. Se añaden las cartas generadas a la colección de cartas del usuario.
 * 10. Se retorna un mensaje de éxito.
 * 
 *  Si ocurre un error, se aborta la transacción y se retorna un mensaje de error.
 * 
 * @param req request, debe contener el nombre de usuario y el identificador del paquete de cartas.
 * @param res response, retorna un mensaje de éxito con las cartas generadas o un mensaje de error.
 * @returns lista de cartas generadas
 * @throws 500 - Si se produce un error al comprar el paquete de cartas.
 */

const purchaseCardPack = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        let { username, cardPackId } = req.body;

        username = username.toLowerCase();

        const cardPack = await CardPack.findOne({ cardPackId: cardPackId }).session(session);
        if (!cardPack) {
            throw new Error("El paquete de cartas no existe.");
        }

        // Verificar que haya disponibilidad del paquete de cartas
        if (cardPack.availableQuantity <= 0 || !cardPack.available) {
            throw new Error("El paquete de cartas está agotado.");
        }


        // Verificar que el usuario tenga suficiente saldo para comprar el paquete
        const price = cardPack.price;

        let user = await User.findOne({ username_lower: username }).session(session);

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
                // console.log("Generar cartas del mazo " + deckId + " con cantidad " + quantity)
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


            const newUserCard = new UserCard({
                user: user._id,
                username: user.username_lower,
                card: card._id,
                legibleCardId: card.cardId,
                status: CardStatus.NotForSale,
                transactionHistory: []
            });

            const newTransaction = new Transaction({
                user: user._id,
                username: user.username_lower,
                concept: TransactionConcept.PurchaseByCardPack,
                date: new Date(),
                userCard: newUserCard._id,
                price: price,
                cardId: card._id,
                legibleCardId: card.cardId,
                cardPackId: cardPack._id,
                legibleCardPackId: cardPack.cardPackId
            });

            newUserCard.transactionHistory.push(newTransaction._id);

            // Añadir referencia a la carta del usuario en la carta genérica
            card.cards.push(newUserCard._id);

            await card.save({ session });

            await newTransaction.save({ session });

            await newUserCard.save({ session });
        }



        await session.commitTransaction();

        res.status(200).json({ message: "Las cartas se han comprado correctamente.", cards: allGeneratedCards });

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
async function generateCards(deckId: string, quantity: number, session: any): Promise<ICard[]> {
    let cards: ICard[] = [];
    const deck: IDeck | null = await getDeckByDeckId(deckId, session);
    if (!deck) {
        return cards; // Retorna un array vacío si el mazo no tiene cartas.
    }

    let cardsIds = deck.cards.map(card => card._id);

    while (cards.length < quantity && cardsIds.length > 0) {
        const randomIndex = Math.floor(Math.random() * cardsIds.length);
        const cardId = cardsIds.splice(randomIndex, 1)[0];

        let generatedCardAux = await Card.findById(cardId).session(session);
        let generatedCard = generatedCardAux as unknown as ICard | null;
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
