import Joi, { string } from 'joi';
import { ITask } from '../../types/task.types';
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields';
import { Stauts } from '../../constants/status';

interface ICreateTaskSchema extends ITask {
	scrumId: string;
}

interface IUpdateTaskSchema extends ITask {
	taskId: string;
}
export const createTaskSchema = Joi.object<ICreateTaskSchema>({
	taskName: Joi.string().required(),
	description: Joi.string().required(),
	startDate: Joi.date().greater(Date.now()),
	deadline: Joi.date().greater(Date.now()),
	status: Joi.string().valid(Stauts.TODO),
	scrumMaster: CUSTOM_FIELDS_SCHEMAS.objectId,
	project: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
	sprint: CUSTOM_FIELDS_SCHEMAS.objectId,
	assignTo: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
	scrumId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const updateTaskSchema = Joi.object<IUpdateTaskSchema>({
	taskName: Joi.string(),
	description: Joi.string(),
	deadline: Joi.date().greater(Date.now()),
	status: Joi.string().valid(Stauts.TODO, Stauts.DOING, Stauts.DONE),
	assignTo: CUSTOM_FIELDS_SCHEMAS.objectId,
	taskId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const updateStatusSchema = Joi.object<IUpdateTaskSchema>({
	status: Joi.string().valid(Stauts.TODO, Stauts.DOING, Stauts.DONE),
	taskId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();
