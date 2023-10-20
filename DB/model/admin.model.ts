import mongoose, {Schema, model, Types, InferSchemaType} from 'mongoose';
import { IAdmin } from '../../src/types/admin.types';
import {hash, genSalt} from 'bcryptjs'

export type AdminSchemaType = InferSchemaType<typeof adminSchema>
interface IAdminDocument extends IAdmin {}

const adminSchema = new Schema<IAdminDocument>({
    adminName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    organization: {
        type: Types.ObjectId,
        ref: 'Organization'
    }
}, {
    timestamps: true
})

adminSchema.pre('save', async function(next){
    if (this.isModified('password')) {
        const salt = await genSalt(Number(process.env.SALT_ROUNDS))
        this.password = await hash(this.password, salt)        
    }
    next()
})

export const AdminModel = model<IAdminDocument>('Admin', adminSchema)