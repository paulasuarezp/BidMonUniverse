import csvParser from 'csv-parser';
import fs from 'fs';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import CardPack from '../models/cardpack';

dotenv.config();

const mongoURI: string = process.env.MONGO_URI!;

interface CardPackData {
    cardPackId: string, // Del tipo CP-000, CP-001, CP-002 ... CP-NNN
    name: string,
    price: Number,
    releaseDate: string, // Formato: "YYYY-MM-DD"
    numberOfCards: Number,
    deckId1: string,
    quantity1: Number,
    deckId2: string,
    quantity2: Number,
    deckId3: string,
    quantity3: Number,
    availableQuantity: Number,
    available: Boolean,
}

interface ContentSchema {
    deckId: string, // Unique identifier for the deck, format "D-XXXX"
    quantity: Number
}

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

    const records: CardPackData[] = [];

    fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';' }))
        .on('data', (data: CardPackData) => records.push(data))
        .on('end', async () => {
            console.log('CSV file successfully processed');
            
            const saveCardPackPromises = records.map(async item => {

                const content: ContentSchema[]= [];
                if(item.deckId1) 
                    content.push({ deckId: item.deckId1, quantity: item.quantity1 });
                if(item.deckId2) 
                    content.push({ deckId: item.deckId2, quantity: item.quantity2 });
                if(item.deckId3) 
                    content.push({ deckId: item.deckId3, quantity: item.quantity3 });

                let cardPack = await CardPack.findOne({ cardPackId: item.cardPackId }); // Evitar duplicados

                if(cardPack) { // Si el mazo ya existe, actualizar las cartas
                    console.log(`Card pack ${cardPack.name} already exists`);
                    console.log(`Updating card pack ${cardPack.name}`);
                    cardPack.price = item.price as number;
                    cardPack.releaseDate = new Date(item.releaseDate);
                    cardPack.numberOfCards = item.numberOfCards as number;
                    cardPack.deckId1 = item.deckId1;
                    cardPack.quantity1 = item.quantity1 as number;
                    cardPack.deckId2 = item.deckId2;
                    cardPack.quantity2 = item.quantity2 as number;
                    cardPack.deckId3 = item.deckId3;
                    cardPack.quantity3 = item.quantity3 as number;
                    cardPack.availableQuantity = item.availableQuantity as number;
                    await cardPack.save();
                }
                else {
                    console.log(`Card pack ${item.name} does not exist, creating it...`);
                    cardPack = new CardPack({
                        ...item,
                        releaseDate: new Date(item.releaseDate),
                    });
                    await cardPack.save();
                }
            });

            await Promise.all(saveCardPackPromises);
            console.log('Card packs data loaded successfully');
            
            // Desconectar después de todas las operaciones
            await mongoose.disconnect();
            console.log("Disconnected from MongoDB.");
        }
    );
}

loadCSVData('data/cardPacks_data.csv');

