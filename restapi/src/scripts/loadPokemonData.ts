import csvParser from 'csv-parser';
import fs from 'fs';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import Card from '../models/card';
import { CardData } from './fetchPokemonData';

dotenv.config();

const mongoURI: string = process.env.MONGO_URI!;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

function loadCSVData(filePath: string) {
  const records: CardData[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser({
      separator: ';'  
    }))
    .on('data', (data: CardData ) => records.push(data))
    .on('end', () => {
      console.log('CSV file successfully processed');
      const processedResults = records.map(item => ({
            ...item,
            pokemonId: item.pokemonId,  
            cards:  [],  // Lista de cartas vendidas --> Inicialmente vacía
        }));

        Card.insertMany(processedResults)
            .then(() => console.log('Todos los datos han sido cargados correctamente.'))
            .catch(error => console.error('Error al cargar datos:', error));
        });
        mongoose.disconnect().then(() => console.log("Disconnected from MongoDB."));
}

loadCSVData('data/cards_data.csv');