import { model, Schema, Document } from 'mongoose';
import { NotificationImportance, NotificationType } from './utils/enums';

export interface INotificacion extends Document {
  usuarioId: Schema.Types.ObjectId;
  username: string;
  tipo: NotificationType;
  mensaje: string;
  leída: boolean;
  fechaCreación: Date;
  fechaLectura?: Date;
  importancia: NotificationImportance;
  tiempoReal: boolean;
}

const notificacionSchema = new Schema<INotificacion>({
  usuarioId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'  // Asumiendo que tienes un modelo de Usuario
  },
  username: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: Object.values(NotificationType),
    required: true,
    default: NotificationType.System
  },
  mensaje: {
    type: String,
    required: true
  },
  leída: {
    type: Boolean,
    required: true,
    default: false
  },
  fechaCreación: {
    type: Date,
    required: true
  },
  fechaLectura: {
    type: Date,
    required: false
  },
  importancia: {
    type: String,
    enum: Object.values(NotificationImportance),
    required: true,
    default: NotificationImportance.Low
  },
  tiempoReal: {
    type: Boolean,
    default: false
  }
});

const Notificacion = model<INotificacion>('Notificacion', notificacionSchema);
export default Notificacion;