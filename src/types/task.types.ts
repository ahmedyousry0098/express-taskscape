import { Types } from 'mongoose';
import { Stauts } from '../constants/status';

export interface ITask {
	taskName: string;
	description: string;
	startDate: Date;
	deadline: Date;
	status: Stauts;
	scrumMaster: typeof Types.ObjectId;
	project: typeof Types.ObjectId;
	assignTo: typeof Types.ObjectId;
	sprint: typeof Types.ObjectId;
}
