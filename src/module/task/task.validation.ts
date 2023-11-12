import Joi, { string } from 'joi';
import { ITask } from '../../types/task.types';
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields';
import { Stauts } from '../../constants/status';

interface ICreateTaskSchema extends ITask {
	sprintId: string;
}

interface IUpdateTaskSchema extends ITask {
	taskId: string;
}
export const createTaskSchema = Joi.object<ICreateTaskSchema>({
	taskName: Joi.string().required(),
	description: Joi.string().required(),
	startDate: Joi.date().min(new Date().toLocaleDateString()).messages({
		'date.base': 'Start Date must be a valid date.',
		'date.min': 'Start Date must be later than or equal to today.'
	}),
	deadline: Joi.date().greater(Joi.ref('startDate')).messages({
        'date.base': 'Deadline must be a valid date.',
        'date.greater': 'Deadline must be later than the start date.'
    }),
	status: Joi.string().valid(...Object.values(Stauts)).messages({
		'string.base': 'Status must be a string.',
		'string.valid': 'Invalid status provided. Must be "todo", "doing", or "done".'
	}),
	project: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
	sprintId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
	assignTo: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const updateTaskSchema = Joi.object<IUpdateTaskSchema>({
	taskName: Joi.string(),
	description: Joi.string(),
	deadline: Joi.date().min(new Date().toLocaleDateString()).messages({
        'date.base': 'Deadline must be a valid date.',
        'date.greater': 'Deadline must be later than the start date.'
    }),
	status: Joi.string().valid(Stauts.TODO, Stauts.DOING, Stauts.DONE).messages({
		'string.base': 'Status must be a string.',
		'string.valid': 'Invalid status provided. Must be "todo", "doing", or "done".'
	}),
	assignTo: CUSTOM_FIELDS_SCHEMAS.objectId,
	taskId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const updateStatusSchema = Joi.object<IUpdateTaskSchema>({
	status: Joi.string().valid(Stauts.TODO, Stauts.DOING, Stauts.DONE).messages({
		'string.base': 'Status must be a string.',
		'string.valid': 'Invalid status provided. Must be "todo", "doing", or "done".'
	}),
	taskId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const getEmployeeTasksSchema = Joi.object({
	empId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const getScrumTasksSchema = Joi.object({
	scrumId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()