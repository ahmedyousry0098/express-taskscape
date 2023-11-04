import { Types } from "mongoose";

export interface INotification {
    title: string;
    description: string;
    type: string
    to: typeof Types.ObjectId
}

export enum NotificationType {
    ADDED_TASK = "added task",
    TASK_STATUS = "task status"
}