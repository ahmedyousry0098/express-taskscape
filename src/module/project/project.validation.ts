import Joi, { date } from "joi";
import { IProject } from "../../types/project.types";
import { CUSTOM_FIELDS_SCHEMAS } from "../../constants/schema_validation_fields";

export interface ICreateProjectSchema extends IProject {}

export const createProjectSchema = Joi.object<ICreateProjectSchema>({
    projectName: Joi.string().required(),
    description: Joi.string(),
    startDate: Joi.date().greater(Date.now()),
    deadline: Joi.date().greater(Date.now()),
    organization: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
    scrumMaster: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
    employees: Joi.array().items(CUSTOM_FIELDS_SCHEMAS.objectId).required()
}).required()
