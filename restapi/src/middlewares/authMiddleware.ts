import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');

const auth = (req: Request, res: Response, next: any) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extraer el token del header
    if (!token) return res.status(401).send('Acceso denegado.');

    try {
        jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    } catch (error) {
        res.status(400).send('Token inválido. Acceso denegado.');
    }
};


module.exports = auth;
