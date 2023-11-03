import Joi from "joi";
import { CUSTOM_FIELDS_SCHEMAS } from "../../constants/schema_validation_fields";
import { ISprint } from "../../types/sprint.types";

interface ICreateSprintSchema extends ISprint {
    projectId: string
}
interface IProjectId {
    projectId: string
}

export const createSprintSchema = Joi.object<ICreateSprintSchema>({
    sprint_name: Joi.string().required(),
    start_date: Joi.date().min(new Date().toLocaleDateString()),
    deadline: Joi.date().greater(Joi.ref('start_date')),
    projectId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
    organization: CUSTOM_FIELDS_SCHEMAS.objectId,
}).required()

export const getProjectSprintsSchema = Joi.object<IProjectId>({
    projectId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
})