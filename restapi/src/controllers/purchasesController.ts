import { Request, Response } from "express";
import CardPack from "../models/cardpack";
import { getDeckById } from "./deckController";
import { getCardById } from "./cardController";
import  Card  from "../models/card";
import Transaction from "../models/transaction";
import UserCard from "../models/userCard";
import mongoose from "mongoose";
import { CardStatus, TransactionConcept } from "../models/utils/enums";


const purchaseCardPack = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { userId, cardPackId } = req.body;

        const cardPack = await CardPack.findById(cardPackId).session(session);
        if (!cardPack) {
            throw new Error("Card pack not found.");
        }

        // Variables para acumular todas las cartas generadas de todos los mazos
        let allGeneratedCards: typeof Card[] = [];

        // Llama a generateCards para cada deckId mencionado en el cardPack
        if (cardPack.deckId1 && cardPack.quantity1) {
            const cardsFromDeck1 = await generateCards(cardPack.deckId1, cardPack.quantity1, session);
            allGeneratedCards = allGeneratedCards.concat(cardsFromDeck1);
        }
        if (cardPack.deckId2 && cardPack.quantity2) {
            const cardsFromDeck2 = await generateCards(cardPack.deckId2, cardPack.quantity2, session);
            allGeneratedCards = allGeneratedCards.concat(cardsFromDeck2);
        }
        if (cardPack.deckId3 && cardPack.quantity3) {
            const cardsFromDeck3 = await generateCards(cardPack.deckId3, cardPack.quantity3, session);
            allGeneratedCards = allGeneratedCards.concat(cardsFromDeck3);
        }

        // Crear y guardar transacciones para cada carta
        for (const card of allGeneratedCards) {
            const newTransaction = new Transaction({
                user: req.body.user,
                userCard: req.body.userCard,
                concept: TransactionConcept.CardPack,
                date: new Date(),
                price: req.body.price,
                cardId: req.body.cardId,
                auctionId: req.body.auctionId,
                cardPackId: req.body.cardPackId
            });
            await newTransaction.save({ session });

            const userCard = new UserCard({
                user: req.params.userId,
                card: card._id,
                status: CardStatus.NotForSale,
                transactionHistory: [newTransaction._id]
            });

            await userCard.save({ session });
        }

        await session.commitTransaction();
        res.status(200).json({ message: "Cards successfully purchased", cards: allGeneratedCards });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: error.message || "Failed to purchase card pack." });
    } finally {
        session.endSession();
    }
};


// Función para generar cartas aleatorias de un mazo
async function generateCards(deckId, quantity, session) {
    let cards: typeof Card[] = [];
    const deck = await getDeckById(deckId, session);
    if (!deck) {
        return cards;
    }
    while (cards.length < quantity) {
        const randomIndex = Math.floor(Math.random() * deck.cards.length);
        const cardId = deck.cards[randomIndex];
        const generatedCard: any = await getCardById(cardId, session); 
        if (!generatedCard || generatedCard.availableQuantity <= 0 || cards.includes(generatedCard)) {
            continue;
        }
        cards.push(generatedCard);
        generatedCard.availableQuantity--;
        await generatedCard.save({ session });
    }
    return cards;
}
