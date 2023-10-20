import mongoose, { Schema, InferSchemaType } from 'mongoose'
import { IOrganization } from '../../src/types/organization.types'

export type OrganizationSchemaType = InferSchemaType<typeof organizationSchema>
interface IOrganizationDocument extends IOrganization {}

const organizationSchema = new Schema<IOrganizationDocument>({
    organization_name: {
        type: String,
        required: true,
        minlength: [3, 'too short name']
    },
    company: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'too short name']
    },
    description: {
        type: String,
    },
    headQuarters: {
        type: String
    },
    logo: {
        public_id: String,
        secure_url: String
    },
    industry: {
        type: String,
        default: 'software development'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const OrganizationModel = mongoose.model<IOrganizationDocument>('Organization', organizationSchema)