import mongoose, { InferSchemaType, Schema, Types } from 'mongoose';
import { ITask } from '../../src/types/task.types';

export type TaskSchemaType = InferSchemaType<typeof taskSchema>;

interface ITaskDocument
	extends mongoose.Document<typeof Types.ObjectId>,
		ITask {}

const taskSchema = new Schema<ITaskDocument>(
	{
		taskName: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		startDate: {
			type: Date,
			default: new Date(),
		},
		deadline: {
			type: Date,
		},
		scrumMaster: {
			type: Types.ObjectId,
			ref: 'Employee',
			required: true,
		},
		project: {
			type: Types.ObjectId,
			ref: 'Project',
			required: true,
		},
		assignTo: {
			type: Types.ObjectId,
			ref: 'Employees',
		},

		sprint: {
			type: Types.ObjectId,
			ref: 'Sprint',
		},
	},
	{ timestamps: true }
);

export const TaskModel = mongoose.model('Task', taskSchema);