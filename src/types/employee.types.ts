import { Types } from 'mongoose';

export interface IEmployee {
	employeeName: string;
	email: string;
	password: string;
	role: 'scrumMaster' | 'member';
	lastChangePassword: Date;
	createdBy: typeof Types.ObjectId;
	organization: typeof Types.ObjectId;
}
