
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { CardRarity } from '../models/utils/enums';

export interface DeckData {
    deckId: String, // Del tipo D000, D001, D002 ... DNNN
    name: String,
    type: String, // Rareza de la carta
    publicationDate: Date,
}

async function fetchAndStoreDecks() {
    const csvWriter = createCsvWriter({
        path: 'data/decks_data.csv',
        header: [
            { id: 'deckId', title: 'deckId' }, // Format: "d-<deckId>-n"
            { id: 'name', title: 'name' },
            { id: 'type', title: 'type' },
            { id: 'publicationDate', title: 'publicationDate' },
            { id: 'cards', title: 'cards' },
        ],
        fieldDelimiter: ';',
    });

    const decks: DeckData[] = [];
    console.log('Fetching decks data...');
    let cont = 0;
    for(let rarity in CardRarity) {
        const deckId = `d-${cont}-n`;
        const name = `Deck ${rarity}`;
        const type = rarity;
        const publicationDate = new Date();
        cont++;
        decks.push({ deckId, name, type, publicationDate });
    }

    await csvWriter.writeRecords(decks);
    console.log('Decks data fetched and stored in data/decks_data.csv');
}

fetchAndStoreDecks();