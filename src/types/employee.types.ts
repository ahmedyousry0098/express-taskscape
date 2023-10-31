import { Types } from 'mongoose';
import { UserRole } from '../constants/user.role';
import { IProject } from './project.types';
import { IImage } from './image.types';

export interface IEmployee {
	employeeName: string;
	email: string;
	password: string;
	role: UserRole;
	lastChangePassword: Date;
	createdBy: typeof Types.ObjectId;
	organization: typeof Types.ObjectId;
	profile_photo?: IImage;
	isFresh: boolean
}

export interface IEmployeeWithPojects extends IEmployee {
	projects: Pick<IProject, 'projectName'|'description'>
}