// authSocket.ts
import { Socket } from "socket.io";
import jwt from 'jsonwebtoken';

const authSocket = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Acceso denegado. Token no proporcionado.'));
    }

    // Extraer el token de la cabecera Authorization
    const parts = token.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return next(new Error('Token inválido. El formato del token debe ser Bearer [token].'));
    }
    const tokenString = parts[1];

    jwt.verify(tokenString, process.env.TOKEN_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            return next(new Error('Token inválido o expirado.'));
        }
        next();
    });
};

export default authSocket;
