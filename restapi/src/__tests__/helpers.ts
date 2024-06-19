import bcrypt from 'bcryptjs'
import { app } from '../../app'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Model } from 'mongoose'
import UserCard from '../models/userCard'
import Transaction from '../models/transaction'
import CardPack from '../models/cardpack'
import Deck from '../models/deck'
import Card from '../models/card'
import User from '../models/user'

const supertest = require('supertest')
require('dotenv').config()

const api = supertest(app)


interface ICollection {
    name: string;
    model: Model<any>;
}

const collections: ICollection[] = [
    { name: 'Transaction', model: Transaction },
    { name: 'UserCard', model: UserCard },
    { name: 'Card', model: Card },
    { name: 'Deck', model: Deck },
    { name: 'User', model: User },
    { name: 'CardPack', model: CardPack }
];


const hashPassword = (password) => {
    const rounds = 10
    const salt = bcrypt.genSaltSync(rounds)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

const checkPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

const dropDatabase = async (): Promise<void> => {
    const maxRetries = 3; // Número máximo de intentos

    for (const { name, model } of collections) {
        let success = false;
        let attempts = 0;

        while (!success && attempts < maxRetries) {
            attempts++;
            try {
                console.log(`Intento ${attempts} de borrar ${name}...`);
                const result = await model.deleteMany({});
                console.log(`${name} - Documentos borrados: ${result.deletedCount}`);

                // Considera un intento exitoso si se eliminan registros, o si ya no hay registros que eliminar.
                if (result.deletedCount > 0 || attempts === maxRetries) {
                    success = true;
                }
            } catch (error: any) { // Añade typing explícito para el error
                console.log(`Error al intentar borrar ${name} en el intento ${attempts}: ${error.message}`);
                if (attempts === maxRetries) {
                    console.error(`Fallo al borrar ${name} después de ${maxRetries} intentos.`);
                    throw new Error(`Fallo al borrar ${name} después de ${maxRetries} intentos. Detalle: ${error.message}`);
                }
            }
        }

        if (!success) {
            console.error(`No se pudo borrar la colección ${name} después de ${maxRetries} intentos.`);
            return; // Detiene el proceso si no se puede borrar una colección crítica.
        }
    }

    console.log('Todos los intentos de borrado han sido completados.');
};

export const dropEntireDatabase = async (): Promise<void> => {
    try {
        await mongoose.connection.dropDatabase();
        // console.log('Database has been dropped successfully.');
    } catch (error: any) {
        console.error('Failed to drop the database:', error.message);
    }
};


const getToken = (username, role) => {
    let token = jwt.sign(
        { username: username, role: role, time: Date.now() / 1000 },
        process.env.TOKEN_SECRET!
    );
    return token
}


export {
    api,
    hashPassword,
    checkPassword,
    getToken,
    dropDatabase
}