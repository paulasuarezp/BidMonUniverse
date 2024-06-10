import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import path from 'path';
import { loadDecksData, loadCardPacksData, loadCardsData } from './initialData';

let mongoServer: MongoMemoryServer;

module.exports = async () => {
    mongoServer = new MongoMemoryServer();
    await mongoServer.start();
    const mongoUri = await mongoServer.getUri();

    process.env.TEST_MONGO_URI = mongoUri;

    await mongoose.connect(mongoUri);

    // Cargar datos de prueba
    const decksCsvPath = path.resolve(__dirname, './data/decks_data.csv');
    await loadDecksData(decksCsvPath);

    const cardPacksCsvPath = path.resolve(__dirname, './data/cardPacks_data.csv');
    await loadCardPacksData(cardPacksCsvPath);

    const cardsCsvPath = path.resolve(__dirname, './data/cards_data.csv');
    await loadCardsData(cardsCsvPath);

    await mongoose.disconnect();

    globalThis.__MONGOD__ = mongoServer; // Almacenar la instancia globalmente
};
