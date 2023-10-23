import { Types } from 'mongoose';

export interface IProject {
	projectName: string;
	startDate: string;
	describtion: string;
	createdBy: typeof Types.ObjectId;
	organization: typeof Types.ObjectId;
}
