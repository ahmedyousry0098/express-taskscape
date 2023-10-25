import { Types } from 'mongoose';

export interface ITask {
	taskName: string;
	description: string;
	startDate: Date;
	deadline: Date;
	scrumMaster: typeof Types.ObjectId;
	project: typeof Types.ObjectId;
	assignTo: (typeof Types.ObjectId)[];
	sprint: typeof Types.ObjectId;
}
