import mongoose from 'mongoose';
import path from 'path';
import { loadDecksData, loadCardPacksData, loadCardsData } from './data/initialData';

module.exports = async () => {
    const mongoUri = process.env.TEST_MONGO_URI;

    if (!mongoUri) {
        throw new Error('TEST_MONGO_URI is not defined');
    }

    await mongoose.connect(mongoUri);

    // Cargar datos de prueba
    const decksCsvPath = path.resolve(__dirname, './data/decks_data.csv');
    await loadDecksData(decksCsvPath);

    const cardPacksCsvPath = path.resolve(__dirname, './data/cardPacks_data.csv');
    await loadCardPacksData(cardPacksCsvPath);

    const cardsCsvPath = path.resolve(__dirname, './data/cards_data.csv');
    await loadCardsData(cardsCsvPath);

    await mongoose.disconnect();
};
