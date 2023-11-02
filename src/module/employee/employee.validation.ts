import Joi from 'joi';
import { IEmployee } from '../../types/employee.types';
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields';
import { AdminSchemaType } from '../../../DB/model/admin.model';
import { UserRole } from '../../constants/user.role';
import { IImageFile } from '../../types/image.types';
import { EmploymentType } from '../../constants/employment_type';

interface ICreateEmployeeSchema extends IEmployee {}

interface IChangeEmployeePassword extends Pick<IEmployee, 'password'> {
	password: string;
	newPassword: string;
	employeeId: string;
}
interface IOnlyObjectId {
	orgId: string;
}

export const createEmployeeSchema = Joi.object<ICreateEmployeeSchema>({
	employeeName: Joi.string().min(3).max(20).required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	role: Joi.string().valid(UserRole.EMPLOYEE, UserRole.SCRUM_MASTER).required(),
	experience: Joi.number().positive().max(50).allow(0).required(),
	employmentType: Joi.string().valid(...Object.values(EmploymentType)).required(),
	title: Joi.string().min(2).max(50).required()
}).required();

export const changePasswordSchema = Joi.object<IChangeEmployeePassword>({
	password: Joi.string().required(),
	newPassword: Joi.string().invalid(Joi.ref('password')).required(),
	employeeId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const changeEmpStatusSchema = Joi.object({
	empId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const getAllEmployeeForScrumSchema = Joi.object<IOnlyObjectId>({
	orgId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const updateProfilePhotoSchema = Joi.object({
	file: CUSTOM_FIELDS_SCHEMAS.file.required(),
	employeeId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
})