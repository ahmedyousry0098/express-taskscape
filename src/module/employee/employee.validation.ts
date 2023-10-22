import Joi from 'joi';
import { IEmployee } from '../../types/employee.types';
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields';

interface ICreateEmployeeSchema extends IEmployee {}

export const createEmployeeSchema = Joi.object<ICreateEmployeeSchema>({
	employeeName: Joi.string().min(3).max(20).required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	role: Joi.string().valid('scrumMaster', 'member').required(),
	createdBy: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
	organization: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

//login validation same as loginAdminSchema
