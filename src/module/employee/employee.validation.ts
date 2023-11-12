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
interface IForgetPass {
	email: string
}
interface IResetPass {
	email: string;
	newPassword: string;
	code: string;
}

export const createEmployeeSchema = Joi.object<ICreateEmployeeSchema>({
	employeeName: Joi.string().min(3).max(20).required().messages({
		'string.base': 'Password must be a string.',
		'string.min': 'Password must be at least {#limit} characters long.',
		'string.max': 'Password cannot exceed {#limit} characters.',
		'any.required': 'Password is required.'
	}),
	email: CUSTOM_FIELDS_SCHEMAS.email.required(),
	password: CUSTOM_FIELDS_SCHEMAS.password.required(),
	role: Joi.string().valid(UserRole.EMPLOYEE, UserRole.SCRUM_MASTER).required().messages({
		'string.base': 'Role must be a string.',
		'string.valid': 'Invalid role provided. Must be either "member" or "scrumMaster".',
		'any.required': 'Role is required.'
	}),
	experience: Joi.number().positive().max(50).allow(0).required().messages({
		'number.base': 'Experience must be a number.',
		'number.positive': 'Experience must be a positive number.',
		'number.max': 'Experience cannot exceed {#limit}.',
		'any.required': 'Experience is required.'
	  }),
	employmentType: Joi.string().valid(...Object.values(EmploymentType)).required().messages({
		'string.base': 'Employment type must be a string.',
		'string.valid': 'Invalid employment type provided. Must be one of: "part time", "full time", or "intern".',
		'any.required': 'Employment type is required.'
	  }),
	title: Joi.string().min(2).max(50).required().messages({
		'string.base': 'Title must be a string.',
		'string.min': 'Title must be at least {#limit} characters long.',
		'string.max': 'Title cannot exceed {#limit} characters.',
		'any.required': 'Title is required.'
	  })
}).required();

export const changePasswordSchema = Joi.object<IChangeEmployeePassword>({
	password: CUSTOM_FIELDS_SCHEMAS.password.required(),
	newPassword: CUSTOM_FIELDS_SCHEMAS.password.invalid(Joi.ref('password')).required(),
	employeeId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const forgetPasswordSchema = Joi.object<IForgetPass>({
	email: CUSTOM_FIELDS_SCHEMAS.email.required(),
}).required()

export const resetPasswordSchema = Joi.object<IResetPass>({
	email: CUSTOM_FIELDS_SCHEMAS.email.required(),
	newPassword: CUSTOM_FIELDS_SCHEMAS.password.required(),
	code: Joi.string().length(5).required().messages({
		'string.base': 'Code must be a string.',
		'string.length': 'Code must be exactly {#limit} characters long.',
		'any.required': 'Code is required.'
	})
}).required()

export const changeEmpStatusSchema = Joi.object({
	empId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const getAllEmployeeForScrumSchema = Joi.object<IOnlyObjectId>({
	orgId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const updateProfilePhotoSchema = Joi.object({
	file: CUSTOM_FIELDS_SCHEMAS.file.required(),
	employeeId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const deleteEmployeeSchema = Joi.object({
	empId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const replaceEmployeeSchema = Joi.object({
	remEmpId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
	orgId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
	altEmpId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required()
export const replaceScrumSchema = Joi.object({
	remScrumId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
	orgId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
	altScrumId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required()