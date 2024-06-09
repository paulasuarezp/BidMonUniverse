// src/socket.ts
import io, { Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:5001';  // URL del servidor Socket.IO

let socket: Socket;

function connectSocket(token: string, username:string) {
    // Desconectar cualquier socket existente
    if (socket) {
        socket.disconnect();
    }

    // Conectar con el servidor Socket.IO y enviar el token JWT
    socket = io(SERVER_URL, {
        auth: {
            token: `Bearer ${token}`
        },
        query: {
            username  // Envía el username como parte del query
        }
    });

    socket.on('connect', () => {
        console.log('Connected to the server via Socket.IO with ID:', socket.id);
    });

    socket.on('notification', (data: any) => {
        console.log('Received notification:', data);
    });

    socket.on('connect_error', (err: Error) => {
        console.error('Connection Error:', err.message);
    });
}

function disconnectSocket() {
    if (socket) {
        socket.disconnect();
    }
}

export { connectSocket, disconnectSocket };
