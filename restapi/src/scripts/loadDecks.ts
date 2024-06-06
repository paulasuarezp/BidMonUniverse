import csvParser from 'csv-parser';
import fs from 'fs';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import Deck from '../models/deck';
import Card from '../models/card';
import { DeckData } from './fetchDecksData';

dotenv.config();

const mongoURI: string = process.env.MONGO_URI!;

async function connectToMongoDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Termina el proceso si la conexión falla
    }
}

async function loadCSVData(filePath: string) {
    await connectToMongoDB();  

    const records: DeckData[] = [];

    fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';' }))
        .on('data', (data: DeckData) => records.push(data))
        .on('end', async () => {
            console.log('CSV file successfully processed');
            
            const saveDeckPromises = records.map(async item => {

                const itemType = item.type.toLowerCase();

                let cards = await Card.find({ rarity: itemType });

                if(itemType === "mythical") {
                    const mythicalCarts = await Card.find({ is_mythical: true });
                    cards = cards.concat(mythicalCarts);
                }

                let deck = await Deck.findOne({ deckId: item.deckId }); // Evitar duplicados

                if(deck) { // Si el mazo ya existe, actualizar las cartas
                    console.log(`Deck ${deck.name} already exists`);
                    console.log(`Adding ${cards.length} cards to deck ${deck.name}`);
                    deck.cards = cards.map(card => card._id);
                    await deck.save();
                }
                else {
                    console.log(`Deck ${item.name} does not existm creating it...`);
                    deck = new Deck({
                        ...item,
                        type: itemType,
                        cards: cards.map(card => card._id)
                    });
                    await deck.save();
                }
                 
               
                console.log(`Deck ${deck.name} saved with ${cards.length} cards`);
            });

            // Espera a que todos los mazos se guarden
            await Promise.all(saveDeckPromises);
            console.log("All decks have been saved.");
            
            // Desconectar después de todas las operaciones
            await mongoose.disconnect();
            console.log("Disconnected from MongoDB.");
        });
}

loadCSVData('data/decks_data.csv');
