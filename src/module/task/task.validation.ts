import Joi from 'joi';
import { ITask } from '../../types/task.types';
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields';

export interface ICreateTaskSchema extends ITask {}

export const createTaskSchema = Joi.object<ICreateTaskSchema>({
	taskName: Joi.string().required(),
	description: Joi.string().required(),
	startDate: Joi.date().greater(Date.now()),
	deadline: Joi.date().greater(Date.now()),
	scrumMaster: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
	sprint: CUSTOM_FIELDS_SCHEMAS.objectId,
	assignTo: Joi.array().items(CUSTOM_FIELDS_SCHEMAS.objectId).required(),
}).required();
