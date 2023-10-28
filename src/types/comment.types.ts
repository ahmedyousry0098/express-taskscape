import { Types } from 'mongoose';

export interface IComment {
	text: string;
	assignToTask: typeof Types.ObjectId;
	auther: typeof Types.ObjectId;
	date: Date;
}
