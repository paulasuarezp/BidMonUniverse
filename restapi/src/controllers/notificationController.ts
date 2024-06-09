import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Notification, {INotification} from '../models/notification';
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
 * @returns {void} - No retorna un valor directamente, pero envía una respuesta HTTP con un mensaje de confirmación si la operación es exitosa.
 * En caso de error, retorna un estado HTTP con un mensaje de error adecuado.
 *
 * @throws {Error} - Lanza un error con un mensaje explicativo si no se puede marcar la notificación como leída debido a problemas de conexión, falta de autorización,
 * o cualquier otro problema técnico.
 */
const markAsRead = async (req: Request, res: Response) => {
    let notificationId = req.params.notificationId;
    try {
        const notification = await Notification.findByIdAndUpdate(notificationId, { read: true, readDate: new Date() });
        res.status(200).json({ message: "Notificación marcada como leída." });
    } catch (error) {
        res.status(500).json({ message: "Error al marcar la notificación como leída." });
    }
}

/**
 * Elimina una notificación específica.
 * Esta función elimina una notificación de la base de datos, utilizando su ID único.
 *
 * @param {Request} req - El objeto de solicitud HTTP, debe incluir el ID de la notificación a eliminar.
 * @param {Response} res - El objeto de respuesta HTTP utilizado para enviar un mensaje de confirmación o un mensaje de error.
 *
 * @returns {void} - No retorna un valor directamente, pero envía una respuesta HTTP con un mensaje de confirmación si la operación es exitosa.
 * En caso de error, retorna un estado HTTP con un mensaje de error adecuado.
 *
 * @throws {Error} - Lanza un error con un mensaje explicativo si no se puede eliminar la notificación debido a problemas de conexión, falta de autorización,
 * o cualquier otro problema técnico.
 */
const deleteNotification = async (req: Request, res: Response) => {
    let notificationId = req.params.notificationId;
    try {
        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({ message: "Notificación eliminada." });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la notificación." });
    }
}

/**
 * Elimina todas las notificaciones de un usuario.
 * Esta función elimina todas las notificaciones asociadas a un nombre de usuario específico.
 *
 * @param {Request} req - El objeto de solicitud HTTP, debe incluir el nombre de usuario en algún campo del request (ej. req.body o req.params).
 * @param {Response} res - El objeto de respuesta HTTP utilizado para enviar un mensaje de confirmación o un mensaje de error.
 *
 * @returns {void} - No retorna un valor directamente, pero envía una respuesta HTTP con un mensaje de confirmación si la operación es exitosa.
 * En caso de error, retorna un estado HTTP con un mensaje de error adecuado.
 *
 * @throws {Error} - Lanza un error con un mensaje explicativo si no se pueden eliminar las notificaciones debido a problemas de conexión, falta de autorización,
 * o cualquier otro problema técnico.
 */
const deleteAllNotifications = async (req: Request, res: Response) => {
    let username = req.params.username.toLowerCase();
    try {
        await Notification.deleteMany({ username: username });
        res.status(200).json({ message: "Notificaciones eliminadas." });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar las notificaciones." });
    }
}

/**
 * Crea una nueva notificación.
 * Esta función crea una nueva notificación en la base de datos, utilizando los datos proporcionados en el cuerpo de la solicitud.
 *
 * @param {Request} req - El objeto de solicitud HTTP, debe incluir los datos de la notificación en el cuerpo de la solicitud.
 * @param {Response} res - El objeto de respuesta HTTP utilizado para enviar un mensaje de confirmación o un mensaje de error.
 *
 * @returns {void} - No retorna un valor directamente, pero envía una respuesta HTTP con un mensaje de confirmación si la operación es exitosa.
 * En caso de error, retorna un estado HTTP con un mensaje de error adecuado.
 *
 * @throws {Error} - Lanza un error con un mensaje explicativo si no se puede crear la notificación debido a problemas de conexión, falta de autorización, o cualquier otro problema técnico.
 */
const createNotification = async (req: Request, res: Response) => {
    let { username, type, message, importance, realTime } = req.body;
    try {
        const user = await User.findOne({username_lower: username.toLowerCase()});
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        const newNotification = new Notification({
            usuarioId: user._id,
            username: username,
            type: type,
            message: message,
            read: false,
            creationDate: new Date(),
            importance: importance,
            realTime: realTime
        });
        await newNotification.save();

        // Si la notificación es en tiempo real, enviarla a través de un servicio de mensajería en tiempo real
        if (realTime) {
            sendRealTimeNotification(notification);
        }
        res.status(201).json({ message: "Notificación creada." });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la notificación." });
    }
}

/**
 * Comprueba si el usuario tiene notificaciones sin leer.
 * Esta función verifica si el usuario tiene notificaciones sin leer en la base de datos.
 * Retorna un valor booleano indicando si hay notificaciones sin leer o no.
 * 
 * @param {Request} req - El objeto de solicitud HTTP, debe incluir el nombre de usuario.
 * @param {Response} res - El objeto de respuesta HTTP utilizado para enviar un mensaje de confirmación o un mensaje de error.
 * 
 * @returns {void} - No retorna un valor directamente, pero envía una respuesta HTTP con un objeto JSON que contiene un campo "hasUnreadNotifications" con un valor booleano.
 * 
 * @throws {Error} - Lanza un error con un mensaje explicativo si no se puede realizar la verificación debido a problemas de conexión, falta de autorización, o cualquier otro problema técnico.
 */
const hasUnreadNotifications = async (req: Request, res: Response) => {
    let username = req.params.username.toLowerCase();
    try {
        const unreadNotifications = await Notification.exists({ username: username, read: false });
        res.status(200).json({ hasUnreadNotifications: unreadNotifications });
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
        const user = await User.findOne({username_lower: notification.username.toLowerCase()});
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



export { 
    getNotifications, 
    markAsRead, 
    deleteNotification, 
    deleteAllNotifications, 
    createNotification, 
    hasUnreadNotifications,
    sendNotification
};