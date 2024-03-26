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
            password: hashedPassword
        });
    
        
        const savedUser = await user.save();

        // Generar un token JWT para el usuario
        const token = jwt.sign(
            {user: savedUser.username, time: Date.now()/1000}, process.env.TOKEN_SECRET!, { expiresIn: '1h' }
        );


        // Enviar el token al cliente en el header
        res.header('Authorization', 'Bearer ' + token);

        res.status(201);

        // Enviar la respuesta como JSON
         res.json({
            message: 'Usuario creado con éxito.',
            auth: true,
            user: {
                username: savedUser.username,
            },
            token: token
        });
    }
    catch (error: any) {
        if (error.code === 11000) { // Código de error de MongoDB para violaciones de la restricción de unicidad
            res.status(400); // Bad Request
            res.json({
                message: 'El nombre de usuario ya existe. Por favor, elija otro.',
                auth: false
            });
        }
        console.error(error);
        res.status(500); // Internal Server Error
        res.json({
            message: 'Se ha producido un error al crear el usuario. Por favor, inténtelo de nuevo.',
            auth: false
        });
    }
};

// Función para iniciar sesión
const loginUser = async (req: Request, res: Response) => {
    // Buscar al usuario por su nombre de usuario
    const user = await User.findOne({ username: req.body.username }).catch((error: any) => {
        res.status(500); // Internal Server Error
        res.json({
            message: 'Se ha producido un error al verificar credenciales. Por favor, inténtelo de nuevo.',
            auth: false
        });
    });

    if (!user) {
        res.status(401); // Unauthorized
        res.json({
            message: 'Usuario o contraseña incorrectos.',
            auth: false
        });
    } else {
        // Verificar la contraseña
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(401); // Unauthorized
            res.json({
                message: 'Usuario o contraseña incorrectos.',
                auth: false
            });
        }


        // Generar un token JWT para el usuario
        const token = jwt.sign(
            {user: user.username, time: Date.now()/1000}, process.env.TOKEN_SECRET!, { expiresIn: '1h' }
        );

        // Enviar el token al cliente en el header
        res.header('Authorization', 'Bearer ' + token);

        // Enviar el código de estado 200 OK
        res.status(200);

        // Enviar la respuesta como JSON
        res.json({
            message: 'Inicio de sesión exitoso.',
            auth: true,
            user: {
                username: user.username,
            },
            token: token
        });
    } 
};

export {
    createUser,
    loginUser
};
