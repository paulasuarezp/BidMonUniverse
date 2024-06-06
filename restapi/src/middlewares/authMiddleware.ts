import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');

const auth = (req: Request, res: Response, next: any) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extraer el token del header
    if (!token) return res.status(401).send('Acceso denegado.');

    try {
        jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send('Token expirado. Por favor, inicie sesión de nuevo.');
        } else {
            return res.status(400).send('Token inválido. Por favor, inicie sesión de nuevo.');
        }
    }
};

module.exports = auth;
