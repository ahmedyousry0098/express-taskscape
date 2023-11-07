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
	adminName: Joi.string().min(3).max(20).required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	organization: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const loginAdminSchema = Joi.object<ILoginSchema>({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export const forgetPasswordSchema = Joi.object<IForgetPass>({
	email: Joi.string().email().required(),
})

export const resetPasswordSchema = Joi.object<IResetPass>({
	email: Joi.string().email().required(),
	newPassword: Joi.string().required(),
	code: Joi.string().length(5).required()
})