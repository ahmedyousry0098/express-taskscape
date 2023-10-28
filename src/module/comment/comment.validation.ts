import Joi from 'joi';
import { IComment } from '../../types/comment.types';
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields';

interface IAddCommentSchema extends IComment {
	taskId: string;
}
interface IEditCommentSchema extends IComment {
	commentId: string;
}

export const addCommentSchema = Joi.object<IAddCommentSchema>({
	text: Joi.string().required(),
	assignToTask: CUSTOM_FIELDS_SCHEMAS.objectId,
	auther: CUSTOM_FIELDS_SCHEMAS.objectId,
	date: Joi.date().greater(Date.now()),
	taskId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();

export const editCommentSchema = Joi.object<IEditCommentSchema>({
	text: Joi.string().required(),
	date: Joi.date().greater(Date.now()),
	commentId: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required();
