import mongoose, { InferSchemaType, Schema, Types, model } from 'mongoose';
import { IEmployee } from '../../src/types/employee.types';
import { genSalt, hash } from 'bcryptjs';
import { UserRole } from '../../src/constants/user.role';
import { IProjectDocument } from './project.model';
import { EmploymentType } from '../../src/constants/employment_type';

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
			enum: UserRole,
			default: UserRole.EMPLOYEE,
		},
		lastChangePassword: { type: Date },
		experience: {type: Number, requied: true, max: [50, 'max experience years is 50']},
		employmentType: {type: String, enum: EmploymentType, required: true},
		createdBy: { type: Types.ObjectId, ref: 'Admin' },
		organization: { type: Types.ObjectId, ref: 'Organization' },
		profile_photo: {
			public_id: String,
			secure_url: String
		},
		isFresh: {
			type: Boolean,
			default: true
		},
		isDeleted: {
			type: Boolean,
			default: false
		},
		socketId: String,
		resetPasswordCode: String
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

employeeSchema.pre('find', async function (next) {
	this.where({isDeleted: false})
})

export const EmployeeModel = model<IEmployeeDocument>(
	'Employee',
	employeeSchema
);
