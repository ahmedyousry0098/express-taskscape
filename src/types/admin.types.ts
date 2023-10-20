import mongoose, {Types} from "mongoose";

export interface IAdmin {
    _id: typeof Types.ObjectId
    adminName: string;
    email: string;
    password: string;
    organization: typeof Types.ObjectId;
}