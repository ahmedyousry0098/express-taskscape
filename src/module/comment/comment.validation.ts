import Joi from 'joi';
import { IComment } from '../../types/comment.types';
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields';

interface IAddCommentSchema extends IComment {
	taskId: string;
}
interface IEditCommentSchema extends IComment {
	commentId: string;
}
interface IGetCommentsSchema {
	taskId: string
}

export const addCommentSchema = Joi.object<IAddCommentSchema>({
	text: Joi.string().required(),
	date: Joi.date().min(new Date().toLocaleDateString()).messages({
		'date.base': 'Date must be a valid date.',
		'date.min': 'Date must be later than or equal to today.'
	}),
	taskId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const editCommentSchema = Joi.object<IEditCommentSchema>({
	text: Joi.string().required(),
	date: Joi.date().min(new Date().toLocaleDateString()).messages({
		'date.base': 'Field must be a valid date.',
		'date.min': 'Date must be later than or equal to today.'
	}),
	commentId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const getCommentsSchema = Joi.object<IGetCommentsSchema>({
	taskId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()