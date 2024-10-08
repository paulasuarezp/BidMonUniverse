import { Request, Response } from 'express';
import { io } from '../../server';
import Notification, { INotification } from '../models/notification';
import User from '../models/user';

/**
 * Recupera el histórico de notificaciones de un usuario específico.
 * Esta función busca en la base de datos todas las notificaciones asociadas al nombre de usuario proporcionado en el request.
 * Retorna una lista de notificaciones ordenadas por fecha de creación descendente (las más recientes primero).
 *
 * @param {Request} req - El objeto de solicitud HTTP, debe incluir el nombre de usuario en algún campo del request (ej. req.body o req.params).
 * @param {Response} res - El objeto de respuesta HTTP utilizado para enviar las notificaciones recuperadas al cliente o un mensaje de error.
 *
 * @returns {void} - No retorna un valor directamente, pero envía una respuesta HTTP con el array de notificaciones en formato JSON si la operación es exitosa.
 * En caso de error, retorna un estado HTTP con un mensaje de error adecuado.
 *
 * @throws {Error} - Lanza un error con un mensaje explicativo si no se pueden obtener las notificaciones debido a problemas de conexión, falta de autorización,
 * o cualquier otro problema técnico.
 */

const getNotifications = async (req: Request, res: Response) => {
    let username = req.params.username.toLowerCase();
    try {
        // Notificaciones asociadas al nombre de usuario proporcionado, ordenadas por fecha de creación descendente (las más recientes primero)
        const notifications = await Notification.find({ username: username }).sort({ creationDate: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error al recuperar las notificaciones del usuario." });
    }
}

/**
 * Marca una notificación específica como leída.
 * Esta función actualiza el estado de una notificación en la base de datos, marcándola como leída y estableciendo la fecha de lectura.
 *
 * @param {Request} req - El objeto de solicitud HTTP, debe incluir el ID de la notificación a marcar como leída.
 * @param {Response} res - El objeto de respuesta HTTP utilizado para enviar un mensaje de confirmación o un mensaje de error.
 *
 * @returns {void} - No retorna un valor directamente, pero envía una respuesta HTTP con un valor booleano que indica si la operación fue exitosa.
 *
 * @throws {Error} - Lanza un error con un mensaje explicativo si no se puede marcar la notificación como leída debido a problemas de conexión, falta de autorización,
 * o cualquier otro problema técnico.
 */
const markAsRead = async (req: Request, res: Response) => {
    let notificationId = req.params.notificationId;
    try {
        const notification = await Notification.findByIdAndUpdate(notificationId, { read: true, readDate: new Date() });
        res.status(200).json(!!notification);
    } catch (error) {
        res.status(500).json({ message: "Error al marcar la notificación como leída." });
    }
}

/**
 * Marca todas las notificaciones de un usuario como leídas.
 * Esta función actualiza el estado de todas las notificaciones asociadas a un nombre de usuario específico, marcándolas como leídas y estableciendo la fecha de lectura.
 * 
 * @param {Request} req - El objeto de solicitud HTTP, debe incluir el nombre de usuario
 * @param {Response} res - El objeto de respuesta HTTP utilizado para enviar un mensaje de confirmación o un mensaje de error.
 * 
 * @returns {void} - No retorna un valor directamente, pero envía una respuesta HTTP con un valor booleano que indica si la operación fue exitosa.
 * 
 * @throws {Error} - Lanza un error con un mensaje explicativo si no se pueden marcar las notificaciones como leídas debido a problemas de conexión, falta de autorización,
 */
const markAllAsRead = async (req: Request, res: Response) => {
    const username = req.params.username.toLowerCase();
    try {
        const result = await Notification.updateMany(
            { username: username, read: false },
            { read: true, readDate: new Date() }
        );
        const notificationsUpdated = result.modifiedCount;

        res.status(200).json(notificationsUpdated > 0);
    } catch (error) {
        res.status(500).json({ message: "Error al marcar las notificaciones como leídas.", error });
    }
};


/**
 * Comprueba si el usuario tiene notificaciones sin leer.
 * Esta función verifica si el usuario tiene notificaciones sin leer en la base de datos.
 * Retorna un valor booleano indicando si hay notificaciones sin leer o no.
 * 
 * @param {Request} req - El objeto de solicitud HTTP, debe incluir el nombre de usuario.
 * @param {Response} res - El objeto de respuesta HTTP utilizado para enviar un mensaje de confirmación o un mensaje de error.
 * 
 * @returns {void} - No retorna un valor directamente, pero envía una respuesta HTTP con un objeto JSON con un valor booleano.
 * 
 * @throws {Error} - Lanza un error con un mensaje explicativo si no se puede realizar la verificación debido a problemas de conexión, falta de autorización, o cualquier otro problema técnico.
 */
const hasUnreadNotifications = async (req: Request, res: Response) => {
    let username = req.params.username.toLowerCase();
    try {
        const unreadNotifications = await Notification.exists({ username: username, read: false });
        res.status(200).json(!!unreadNotifications);
    } catch (error) {
        res.status(500).json({ message: "Error al verificar las notificaciones." });
    }
}

/**
 * Envía una notificación a un usuario específico.
 * Esta función busca un usuario por el nombre de usuario en minúsculas, crea una nueva notificación basada en los parámetros proporcionados,
 * y la guarda en la base de datos. Si el usuario no se encuentra, lanza un error. 
 * 
 * Esta función está diseñada para ser llamada desde cualquier controlador que necesite enviar notificaciones a los usuarios.
 *
 * @param {INotification} notification - El objeto de notificación que contiene los datos necesarios para crear la notificación. 
 * Debe incluir los campos usuarioId, username, type, message, importance y realTime.
 *
 * @throws {Error} - Lanza un error si el usuario no se encuentra o si ocurre algún problema al guardar la notificación en la base de datos.
 */
const sendNotification = async (notification: INotification) => {
    try {
        const user = await User.findOne({ username_lower: notification.username.toLowerCase() });
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }
        const newNotification = new Notification({
            usuarioId: notification.usuarioId,
            username: notification.username,
            type: notification.type,
            message: notification.message,
            read: false,
            creationDate: new Date(),
            importance: notification.importance,
            realTime: notification.realTime
        });
        await newNotification.save();

        // Si la notificación es en tiempo real, enviarla a través de un servicio de mensajería en tiempo real
        if (notification.realTime) {
            sendRealTimeNotification(notification);
        }
    } catch (error) {
        console.error("Error al enviar la notificación: " + error.message);
        throw new Error("Error al enviar la notificación.");
    }
}

/**
 * Envía una notificación en tiempo real.
 * Esta función envía una notificación en tiempo real a través de un servicio de mensajería en tiempo real.
 * En este caso, se supone que se utiliza Socket.IO para enviar notificaciones en tiempo real a los clientes.
 *
 * @param {INotification} notification - El objeto de notificación que contiene los datos necesarios para enviar la notificación en tiempo real.
 *
 * @throws {Error} - Lanza un error si ocurre algún problema al enviar la notificación en tiempo real.
 */
const sendRealTimeNotification = (notification: INotification) => {
    try {
        io.to(notification.username).emit('notification', {
            type: notification.type,
            message: notification.message,
            importance: notification.importance,
        });
        console.log("Notificación en tiempo real enviada a " + notification.username + ": " + notification.message);
    } catch (error) {
        console.error("Error al enviar la notificación en tiempo real: ", error);
        throw new Error("Error al enviar la notificación en tiempo real.");
    }
}


export {
    getNotifications, hasUnreadNotifications, markAllAsRead, markAsRead, sendNotification
};
