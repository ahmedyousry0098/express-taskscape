import mongoose, { InferSchemaType, Schema, Types } from 'mongoose';
import { IComment } from '../../src/types/comment.types';

export type CommentSchemaType = InferSchemaType<typeof commentSchema>;
interface ICommentDocument
	extends mongoose.Document<typeof Types.ObjectId>,
		IComment {}
const commentSchema = new Schema<ICommentDocument>(
	{
		text: {
			type: String,
			required: true,
		},
		assignToTask: {
			type: Types.ObjectId,
			ref: 'Task',
			required: true,
		},
		auther: {
			type: Types.ObjectId,
			ref: 'Employee',
			required: true,
		},
		date: {
			type: Date,
			default: new Date(),
		},
	},
	{ timestamps: true }
);
export const CommentModel = mongoose.model('Comment', commentSchema);
