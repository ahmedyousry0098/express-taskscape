import Joi from 'joi';
import { IAdmin } from '../../types/admin.types';
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields';

interface IRegisterSchema extends IAdmin {}
interface ILoginSchema {
	email: string;
	password: string;
}
interface IForgetPass {
	email: string
}
interface IResetPass {
	email: string;
	newPassword: string;
	code: string;
}
export const registerAdminSchema = Joi.object<IRegisterSchema>({
	adminName: Joi.string().min(3).max(20).required().messages({
		'string.base': 'Admin name must be a string.',
		'string.min': 'Admin name must be at least 3 characters long.',
		'string.max': 'Admin name cannot exceed 20 characters.',
		'any.required': 'Admin name is required.'
	}),
	email: CUSTOM_FIELDS_SCHEMAS.email.required(),
	password: CUSTOM_FIELDS_SCHEMAS.password.required(),
	organization: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const loginAdminSchema = Joi.object<ILoginSchema>({
	email: CUSTOM_FIELDS_SCHEMAS.email.required(),
	password: CUSTOM_FIELDS_SCHEMAS.password.required(),
}).required()

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