import mongoose, {InferSchemaType, Schema, Types} from 'mongoose'
import { INotification } from '../../src/types/notification.types'

export type NotificationSchemaType = InferSchemaType<typeof notificationSchema>

const notificationSchema = new Schema<INotification>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    to: {
        type: Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    type: {
        type: String
    },
}, {
    timestamps: true
})

export const NotificationModel = mongoose.model<INotification>("Notification", notificationSchema)