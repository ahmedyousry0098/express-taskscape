import mongoose, { Schema, model, Types, InferSchemaType } from 'mongoose';
import { IAdmin } from '../../src/types/admin.types';
import { hash, genSalt } from 'bcryptjs';
import { IOrganizationDocument } from './organization.model';

export type AdminSchemaType = InferSchemaType<typeof adminSchema>;
export interface IAdminDocument extends mongoose.Document<typeof Types.ObjectId>, IAdmin {}
export interface IAdminWithOrg extends Omit<IAdminDocument, 'organization'> {
	organization: IOrganizationDocument
}

const adminSchema = new Schema<IAdminDocument>(
	{
		adminName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		organization: {
			type: Types.ObjectId,
			ref: 'Organization',
		},
		lastChangePassword: {type: Date},
		socketId: String,
		resetPasswordCode: String
	},
	{
		timestamps: true,
	}
);

adminSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		const salt = await genSalt(Number(process.env.SALT_ROUNDS));
		this.password = await hash(this.password, salt);
	}
	next();
});

export const AdminModel = model<IAdminDocument>('Admin', adminSchema);
