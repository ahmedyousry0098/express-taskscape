import Joi from 'joi';
import { IEmployee } from '../../types/employee.types';
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields';
import { AdminSchemaType } from '../../../DB/model/admin.model';

interface ICreateEmployeeSchema extends IEmployee {}

interface IChangeEmployeePassword extends Pick<IEmployee, 'password'> {
	password: string
	newPassword: string;
}

export const createEmployeeSchema = Joi.object<ICreateEmployeeSchema>({
	employeeName: Joi.string().min(3).max(20).required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	role: Joi.string().valid('scrumMaster', 'member').required(),
}).required();

export const changePasswordSchema = Joi.object<IChangeEmployeePassword>({
	password: Joi.string().required(),
	newPassword: Joi.string().invalid(Joi.ref('password')).required(),
});
