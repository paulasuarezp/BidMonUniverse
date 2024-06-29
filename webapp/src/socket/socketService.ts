// src/socket.ts
import io, { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { addNotification, resetNotifications } from '../redux/slices/notificationSlice';
import { store } from '../redux/store';
import { Notification } from '../shared/sharedTypes';

const SERVER_URL = process.env.REACT_APP_API_URI ? `${process.env.REACT_APP_API_URI}` : 'http://localhost:5001'; // Base URL for the User API endpoints


let socket: Socket;

function connectSocket(token: string, username: string) {
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


    socket.on('notification', (data: any) => {
        let notification: Notification = {
            socketId: uuidv4(),
            type: data.type,
            message: data.message,
            importance: data.importance
        };
        store.dispatch(addNotification({ notification: notification }));
    });

}

function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        store.dispatch(resetNotifications());
    }
}

export { connectSocket, disconnectSocket, socket };
