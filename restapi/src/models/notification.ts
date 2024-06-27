import { Document, Schema, Types, model } from 'mongoose';
import { NotificationImportance, NotificationType } from './utils/enums';

export interface INotification extends Document {
  usuarioId: Types.ObjectId; // ObjectId de un usuario
  username: string; // Nombre de usuario
  type: NotificationType; // Tipo de notificación
  message: string; // Mensaje de la notificación
  read: boolean; // true si la notificación fue leída
  creationDate: Date; // Fecha de creación de la notificación
  readDate?: Date; // Fecha de lectura de la notificación
  importance: NotificationImportance; // Importancia de la notificación
  realTime: boolean; // true si la notificación se envía en tiempo real
}

const notificationSchema = new Schema({
  usuarioId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'  // Asumiendo que tienes un modelo de Usuario
  },
  username: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true,
    default: NotificationType.System
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  },
  creationDate: {
    type: Date,
    required: true
  },
  readDate: {
    type: Date,
    required: false
  },
  importance: {
    type: String,
    enum: Object.values(NotificationImportance),
    required: true,
    default: NotificationImportance.Low
  },
  realTime: {
    type: Boolean,
    default: false
  }
});

const Notificacion = model<INotification>('Notification', notificationSchema);
export default Notificacion;