// loadCSVData.ts
import fs from 'fs';
import csvParser from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Card from '../../models/card';
import Deck from '../../models/deck';
import CardPack from '../../models/cardpack';
import { CardRarity, PokemonGym, PokemonType } from '../../models/utils/enums';

dotenv.config();

const mongoURI: string = process.env.TEST_MONGO_URI!;

interface FlavorTextEntry {
    flavor_text: string;
    language: { name: string };
}

interface Encounter {
    location_area: { name: string };
}

interface Stat {
    base_stat: number;
    stat: { name: string };
}

export interface CardData {
    cardId: String, // Del tipo C000, C001, C002 ... CNNN
    pokemonId: Number,
    name: String, // Nombre del pokemon
    rarity: CardRarity, // Rareza de la carta
    releaseDate: Date,
    availableQuantity: Number,
    cards: String,
    pokemonType: PokemonType,
    description: String, // Se obtiene del endpoint pokemon-species/id -> flavor_text
    image: String, // URL a la imagen del pokemon
    hp: Number,
    attack: Number,
    defense: Number,
    specialAttack: Number,
    specialDefense: Number,
    speed: Number,
    weight: Number,
    height: Number,
    is_legendary: Boolean,
    is_mythical: Boolean,
    n_location_area: Number, // Contador de las location_area que aparecen en el endpoint https://pokeapi.co/api/v2/pokemon/id/encounters
    n_encounters: Number, // Contador de los encounter_details que aparecen en el endpoint https://pokeapi.co/api/v2/pokemon/id/encounters
    averageMaxChance: Number, // Media de la probabilidad de capturar a un pokemon https://pokeapi.co/api/v2/pokemon/id/encounters
    pokemonRarity: String, // Rareza del Pokemon
    gym: PokemonGym, // Campo opcional, solo tendrá valor si el Pokemon de la carta es el favorito de algún gimnasio

}

export interface DeckData {
    type: string;
    deckId: string;
    name: string;
}

export interface CardPackData {
    cardPackId: string;
    name: string;
    price: number;
    releaseDate: string;
    numberOfCards: number;
    deckId1: string;
    quantity1: number;
    deckId2: string;
    quantity2: number;
    deckId3: string;
    quantity3: number;
    availableQuantity: number;
    available: boolean;
}

interface ContentSchema {
    deckId: string;
    quantity: number;
}

export async function loadDecksData(filePath: string): Promise<void> {
    const records: DeckData[] = [];

    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser({ separator: ';' }))
            .on('data', (data: DeckData) => records.push(data))
            .on('end', async () => {
                console.log('CSV file successfully processed');

                try {
                    const saveDeckPromises = records.map(async item => {
                        const itemType = item.type.toLowerCase();
                        let cards = await Card.find({ rarity: itemType });

                        if (itemType === "mythical") {
                            const mythicalCarts = await Card.find({ is_mythical: true });
                            cards = cards.concat(mythicalCarts);
                        }

                        let deck = await Deck.findOne({ deckId: item.deckId });

                        if (deck) {
                            console.log(`Deck ${deck.name} already exists`);
                            deck.cards = cards.map(card => card._id);
                            await deck.save();
                        } else {
                            console.log(`Deck ${item.name} does not exist creating it...`);
                            deck = new Deck({
                                ...item,
                                deckId: item.deckId.toLowerCase(),
                                type: itemType,
                                cards: cards.map(card => card._id),
                            });
                            await deck.save();
                        }

                        console.log(`Deck ${deck.name} saved with ${cards.length} cards`);
                    });

                    await Promise.all(saveDeckPromises);
                    console.log("All decks have been saved.");
                    resolve();
                } catch (error) {
                    console.error('Error processing CSV file:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
                reject(error);
            });
    });
}

export async function loadCardPacksData(filePath: string): Promise<void> {
    const records: CardPackData[] = [];

    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser({ separator: ';' }))
            .on('data', (data: CardPackData) => records.push(data))
            .on('end', async () => {
                console.log('CSV file successfully processed');

                try {
                    const saveCardPackPromises = records.map(async item => {
                        const content: ContentSchema[] = [];
                        if (item.deckId1)
                            content.push({ deckId: item.deckId1, quantity: item.quantity1 });
                        if (item.deckId2)
                            content.push({ deckId: item.deckId2, quantity: item.quantity2 });
                        if (item.deckId3)
                            content.push({ deckId: item.deckId3, quantity: item.quantity3 });

                        let cardPack = await CardPack.findOne({ cardPackId: item.cardPackId });

                        if (cardPack) {
                            console.log(`Card pack ${cardPack.name} already exists`);
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
                        } else {
                            console.log(`Card pack ${item.name} does not exist, creating it...`);
                            cardPack = new CardPack({
                                ...item,
                                cardPackId: item.cardPackId.toLowerCase(),
                                releaseDate: new Date(item.releaseDate),
                            });
                            await cardPack.save();
                        }
                    });

                    await Promise.all(saveCardPackPromises);
                    console.log('Card packs data loaded successfully');
                    resolve();
                } catch (error) {
                    console.error('Error processing CSV file:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
                reject(error);
            });
    });
}

export async function loadCardsData(filePath: string): Promise<void> {
    const records = new Map();

    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser({ separator: ';' }))
            .on('data', (data: CardData) => {
                if (!records.has(data.pokemonId)) {
                    records.set(data.pokemonId, {
                        ...data,
                        gym: data.gym.toLowerCase(),
                        cards: []
                    });
                }
            })
            .on('end', async () => {
                console.log('CSV file successfully processed');

                const processedResults = Array.from(records.values());

                try {
                    await Card.insertMany(processedResults);
                    console.log('Todos los datos han sido cargados correctamente.');
                    resolve();
                } catch (error) {
                    console.error('Error al cargar datos:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
                reject(error);
            });
    });
}