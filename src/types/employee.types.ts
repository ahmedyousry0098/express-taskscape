import { Types } from 'mongoose';
import { UserRole } from '../constants/user.role';

export interface IEmployee {
	employeeName: string;
	email: string;
	password: string;
	role: UserRole;
	lastChangePassword: Date;
	createdBy: typeof Types.ObjectId;
	organization: typeof Types.ObjectId;
}
