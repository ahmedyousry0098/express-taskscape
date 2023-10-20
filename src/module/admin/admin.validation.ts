import Joi from "joi"
import { IAdmin } from "../../types/admin.types"
import { CUSTOM_FIELDS_SCHEMAS } from "../../constants/schema_validation_fields"

export const CreateAdminSchema = Joi.object<Omit<IAdmin, "_id">>({
    adminName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    organization: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()