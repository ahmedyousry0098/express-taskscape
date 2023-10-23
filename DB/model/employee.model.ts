import mongoose, { InferSchemaType, Schema, Types, model } from 'mongoose';
import { IEmployee } from '../../src/types/employee.types';
import { genSalt, hash } from 'bcryptjs';

export type EmployeeSchemaType = InferSchemaType<typeof employeeSchema>;

export interface IEmployeeDocument
	extends mongoose.Document<typeof Types.ObjectId>,
		IEmployee {}

const employeeSchema = new Schema<IEmployeeDocument>(
	{
		employeeName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ['scrumMaster', 'member'],
			default: 'member',
		},
		lastChangePassword: { type: Date },

		createdBy: { type: Types.ObjectId, ref: 'Admin' },
		organization: { type: Types.ObjectId, ref: 'Organization' },
	},
	{ timestamps: true }
);

employeeSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		const salt = await genSalt(Number(process.env.SALT_ROUNDS));
		this.password = await hash(this.password, salt);
	}
	next();
});

export const EmployeeModel = model<IEmployeeDocument>(
	'Employee',
	employeeSchema
);
