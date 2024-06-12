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

// Middleware para verificar el token y el rol de administrador
export const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Asume que el token viene en el encabezado como "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No se proporcionó token." });
    }

    try {
        // Verificar el token
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;

        // Verificar si el usuario es admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador." });
        }

        next(); // Continuar al siguiente middleware si es admin
    } catch (error) {
        res.status(400).json({ message: "Token inválido." });
    }
};

export default auth;
