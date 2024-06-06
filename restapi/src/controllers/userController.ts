import User from '../models/user';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';


// Crear nuevo usuario en la base de datos
const createUser = async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send('Debe de introducir un nombre de usuario y una contraseña.');
    }

    try {
        // Generar un salt y hacer hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            username: req.body.username,
            birthday: req.body.birthday,
            password: hashedPassword,
            role: 'standard',
            balance: 100,
        });

        const savedUser = await user.save();

        res.status(201).json({
            message: 'Usuario creado con éxito.',
            user: {
                username: savedUser.username,
                role: savedUser.role,
            }
        });
    }
    catch (error: any) {
        if (error.code === 11000) { // Código de error de MongoDB para violaciones de la restricción de unicidad
            return res.status(400).json({
                message: 'El nombre de usuario ya existe. Por favor, elija otro.',
                auth: false
            });
        }
        console.error(error);
        return res.status(500).json({
            message: 'Se ha producido un error al crear el usuario. Por favor, inténtelo de nuevo.',
            auth: false
        });
    }
};


/**
 * Función para iniciar sesión
 * @param req  Request, con los datos del usuario
 * @param res Response, con la respuesta de la petición y token de autenticación
 * @returns 
 */
const loginUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({
                message: 'Usuario o contraseña incorrectos.',
                auth: false
            });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                message: 'Usuario o contraseña incorrectos.',
                auth: false
            });
        }

        const token = jwt.sign(
            { username: user.username, role:user.role, time: Date.now() / 1000 },
            process.env.TOKEN_SECRET!
        );

        res.header('Authorization', 'Bearer ' + token);
        return res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            auth: true,
            user: {
                username: user.username,
                role: user.role,
                balance: user.balance,
                birthday: user.birthday,
                profileImg: user.profileImg
            },
            token: token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Se ha producido un error al verificar credenciales. Por favor, inténtelo de nuevo.',
            auth: false
        });
    }
};


const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado.'
            });
        }

        return res.status(200).json({
            user: {
                username: user.username,
                role: user.role,
                balance: user.balance,
                birthday: user.birthday,
                profileImg: user.profileImg
            }
        });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Se ha producido un error al buscar el usuario. Por favor, inténtelo de nuevo.'
        });
    }
};


export {
    createUser,
    loginUser,
    getUser
};
