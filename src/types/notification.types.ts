import { Types } from "mongoose";

export interface INotification {
    _id: typeof Types.ObjectId
    title: string;
    description: string;
    type: string
    to: typeof Types.ObjectId,
    isReaded: boolean
}
