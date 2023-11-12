import Joi from "joi";
import { CUSTOM_FIELDS_SCHEMAS } from "../../constants/schema_validation_fields";
import { ISprint } from "../../types/sprint.types";

interface ICreateSprintSchema extends ISprint {
    projectId: string
}
interface IProjectId {
    projectId: string
}
interface ISprintId {
    sprintId: string
}

export const createSprintSchema = Joi.object<ICreateSprintSchema>({
    sprint_name: Joi.string().required(),
    start_date: Joi.date().min(new Date().toLocaleDateString()).messages({
		'date.base': 'Start Date must be a valid date.',
		'date.min': 'Start Date must be later than or equal to today.'
	}),
    deadline: Joi.date().greater(Joi.ref('start_date')).messages({
        'date.base': 'Deadline must be a valid date.',
        'date.greater': 'Deadline must be later than the start date.'
    }),
    projectId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
    organization: CUSTOM_FIELDS_SCHEMAS.objectId,
}).required()

export const getProjectSprintsSchema = Joi.object<IProjectId>({
    projectId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const getSprintDetailsSchema = Joi.object<ISprintId>({
    sprintId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()