import Joi from 'joi';
import { IEmployee } from '../../types/employee.types';
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields';
import { AdminSchemaType } from '../../../DB/model/admin.model';

// interface ICreateEmployeeSchema extends IEmployee {}
interface ICreateEmployeeSchema extends IEmployee {
	admin?: string;
}
export const createEmployeeSchema = Joi.object<ICreateEmployeeSchema>({
	employeeName: Joi.string().min(3).max(20).required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	role: Joi.string().valid('scrumMaster', 'member').required(),
}).required();

//login validation same as loginAdminSchema

interface IChangePassword extends IEmployee {
	newPassword?: string;
}

export const changePasswordSchema = Joi.object<IChangePassword>({
	password: Joi.string().required(),
	newPassword: Joi.string().required(),
});
