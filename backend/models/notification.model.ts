import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
    from: mongoose.Types.ObjectId;
    to: mongoose.Types.ObjectId;
    message: string;
    read: boolean;
    createdAt: Date;
}

const notificationSchema: Schema<INotification> = new Schema({
    from: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }
},{ timestamps: true });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;