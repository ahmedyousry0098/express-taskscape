import { Types } from 'mongoose';

export interface IEmployee {
	employeeName: string;
	email: string;
	password: string;
	role: 'scrumMaster' | 'member';
	createdBy: typeof Types.ObjectId;
	organization: typeof Types.ObjectId;
}
