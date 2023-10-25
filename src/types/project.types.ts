import { Types } from 'mongoose';

export interface IProject {
	projectName: string;
	startDate: Date;
	deadline: Date;
	description: string;
	scrumMaster: typeof Types.ObjectId;
	employees: (typeof Types.ObjectId)[]
	organization: typeof Types.ObjectId;
}
