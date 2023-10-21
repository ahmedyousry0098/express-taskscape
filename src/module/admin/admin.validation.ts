import Joi from "joi"
import { IAdmin } from "../../types/admin.types"
import { CUSTOM_FIELDS_SCHEMAS } from "../../constants/schema_validation_fields"

interface IRegisterSchema extends IAdmin {}
interface ILoginSchema {
    email: string;
    password: string
}

export const registerAdminSchema = Joi.object<IRegisterSchema>({
    adminName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    organization: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const loginAdminSchema = Joi.object<ILoginSchema>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})