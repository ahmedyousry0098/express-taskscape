import Joi from 'joi';
import { IEmployee } from '../../types/employee.types';
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields';
import { AdminSchemaType } from '../../../DB/model/admin.model';
import { UserRole } from '../../constants/user.role';

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
}).required();

export const changePasswordSchema = Joi.object<IChangeEmployeePassword>({
	password: Joi.string().required(),
	newPassword: Joi.string().invalid(Joi.ref('password')).required(),
	employeeId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const getAllEmployeeForScrumSchema = Joi.object<IOnlyObjectId>({
	orgId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();
