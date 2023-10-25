import mongoose, { Types } from 'mongoose';

export interface IAdmin {
	adminName: string;
	email: string;
	password: string;
	organization: typeof Types.ObjectId;
	lastChangePassword: Date
}
