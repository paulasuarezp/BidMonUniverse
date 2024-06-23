import csvParser from 'csv-parser';
import fs from 'fs';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import Card from '../models/card';
import { CardData } from './fetchPokemonData';

dotenv.config();

//const mongoURI: string = process.env.MONGO_URI!;
const mongoURI: string = process.env.TEST_MONGO_URI!;
async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
    return true;  // Devuelve true si la conexión es exitosa
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Termina el proceso si la conexión falla
  }
}

async function loadCSVData(filePath: string) {
  const isConnected = await connectToMongoDB();  
  if (!isConnected) return;  // Si no se conecta, no continuar.

  const records = new Map();  // Usar un Map para evitar IDs duplicados.

  fs.createReadStream(filePath)
    .pipe(csvParser({ separator: ';' }))
    .on('data', (data: CardData) => {
      // Solo añade si el pokemonId no existe ya.
      if (!records.has(data.pokemonId)) {
        records.set(data.pokemonId, {
          ...data,
          gym: data.gym.toLowerCase(),  
          cards: []  // Lista de cartas vendidas --> Inicialmente vacía.
        });
      }
    })
    .on('end', async () => {
      console.log('CSV file successfully processed');

      const processedResults = Array.from(records.values());  

      try {
        await Card.insertMany(processedResults); 
        console.log('Todos los datos han sido cargados correctamente.');
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
      }
    });
}


loadCSVData('data/cards_data.csv');