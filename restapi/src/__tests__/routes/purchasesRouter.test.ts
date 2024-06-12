// tests/cardPackRouter.test.ts
import request from 'supertest';
import { api, dropEntireDatabase, hashPassword } from '../helpers';
import { server } from '../../../server';
import mongoose from 'mongoose';
import User from '../../models/user';
import initialUsers from '../mockData/users.json';
import CardPack from '../../models/cardpack';
import initialCardPacks from '../mockData/cardPacks.json';
import UserCard from '../../models/userCard';
import initialUserCards from '../mockData/usercards.json';
import Transaction from '../../models/transaction';
import initialTransactions from '../mockData/transaction.json';
import initialcards from '../mockData/cards.json';
import initialDecks from '../mockData/decks.json';
import Card from '../../models/card';
import Deck from '../../models/deck';



let tokenAdmin: string;
let token: string;

beforeEach(async () => {
    await dropEntireDatabase();

    let hashedPassword = hashPassword('Password123-');

    for (const user of initialUsers) {
        const newUser = new User(user);
        newUser.password = hashedPassword;
        await newUser.save();
    }

    for (const pack of initialCardPacks) {
        const newCard = new CardPack(pack);
        await newCard.save();
    }

    for (const userCard of initialUserCards) {
        const newUserCard = new UserCard(userCard);
        await newUserCard.save();
    }

    for (const transaction of initialTransactions) {
        const newTransaction = new Transaction(transaction);
        await newTransaction.save();
    }

    for (const deck of initialDecks) {
        const newDeck = new Deck(deck);
        await newDeck.save();
    }


    for (const card of initialcards) {
        const newCard = new Card(card);
        await newCard.save();
    }

    const response = await api.post('/users/login').send({ username: 'admin', password: 'Password123-' });
    tokenAdmin = response.body.token;

    const responseUser = await api.post('/users/login').send({ username: 'test2', password: 'Password123-' });
    token = responseUser.body.token;
});

afterAll(async () => {
    console.log('Deleting all data and closing connection...');
    await mongoose.connection.close();
    await server.close();
});


describe('PURCHASES ROUTES', () => {
    describe('POST /purchases/cardpack', () => {
        it('Successful card pack purchase decreases pack quantity and user balance, and creates user cards and transactions', async () => {
            const cardPackId = 'CP-1';
            const initialCardPack = await CardPack.findOne({ cardPackId: cardPackId });

            const purchaseResponse = await api
                .post('/purchases/cardpack')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'test2', cardPackId: 'CP-1' });

            expect(purchaseResponse.status).toBe(200);

            const updatedUser = await User.findOne({ username: 'test2' });
            const updatedCardPack = await CardPack.findOne({ cardPackId: cardPackId });
            const newUserCards = await UserCard.find({ user: updatedUser._id });
            const newTransactions = await Transaction.find({ user: updatedUser._id });

            // Verificar que el saldo del usuario haya disminuido correctamente
            expect(updatedUser.balance).toBeLessThan(100);

            // Verificar que la cantidad disponible del paquete de cartas haya disminuido

            expect(updatedCardPack.availableQuantity).toBe(initialCardPack.availableQuantity - 1);

            // Verificar que se hayan creado cartas de usuario
            expect(newUserCards.length).toBeGreaterThan(0);

            // Verificar que se hayan creado tantas cartas como se indican en el sobre
            expect(newUserCards.length).toBe(initialCardPack.numberOfCards);

            // Verificar que haya N cartas de cada mazo
            let deck1CardsQuantity = initialCardPack.quantity1;
            let deck1Cards = initialDecks.find(d => d.deckId === initialCardPack.deckId1).cards;

            let deck2CardsQuantity = initialCardPacks.find(p => p.cardPackId === cardPackId).quantity2;
            let deck2Cards = initialDecks.find(d => d.deckId === initialCardPack.deckId2).cards;

            let deck3CardsQuantity = initialCardPack.quantity3;
            let deck3Cards = initialDecks.find(d => d.deckId === initialCardPack.deckId3).cards;

            let deck1CardCont = 0;
            let deck2CardCont = 0;
            let deck3CardCont = 0;
            for (const userCard of newUserCards) {
                if (deck1Cards.includes(userCard.card.toString())) {
                    deck1CardCont++;
                }
                if (deck2Cards.includes(userCard.card.toString())) {
                    deck2CardCont++;
                }
                if (deck3Cards.includes(userCard.card.toString())) {
                    deck3CardCont++;
                }

            }
            expect(deck1CardCont).toBe(deck1CardsQuantity);
            expect(deck2CardCont).toBe(deck2CardsQuantity);
            expect(deck3CardCont).toBe(deck3CardsQuantity);

            // Verificar que se hayan creado transacciones
            expect(newTransactions.length).toBeGreaterThan(0);


        });

        it('Error handling when the user does not exist', async () => {
            const response = await api
                .post('/purchases/cardpack')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'nonexistent_user', cardPackId: 'CP-1' });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'El usuario no existe.');
        });

        it('Error handling when the user does not have enough balance', async () => {
            const response = await api
                .post('/purchases/cardpack')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'admin', cardPackId: 'CP-1' });

            expect(response.status).toBe(500);
        });

        it('Error handling when the card pack does not exist', async () => {
            const cardPackId = 'nonexistent_id';

            const response = await api
                .post('/purchases/cardpack')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'test2', cardPackId });

            expect(response.status).toBe(500);
        });

        it('Error handling when the card pack is not available', async () => {
            const cardPackId = 'nonexistent_id';

            const response = await api
                .post('/purchases/cardpack')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'test2', cardPackId });

            expect(response.status).toBe(500);
        });
    });


});
