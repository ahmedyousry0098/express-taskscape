import mongoose, {InferSchemaType, Schema, Types} from 'mongoose'
import { IProject } from '../../src/types/project.types'

export type ProjectSchemaType = InferSchemaType<typeof projectSchema>

export interface IProjectDocument extends mongoose.Document<typeof Types.ObjectId>, IProject {}
const projectSchema = new Schema<IProjectDocument>({
    projectName: {
        type: String,
        required: true
    },
    description: String,
    startDate: {
        type: Date,
        default: new Date()
    },
    deadline: {
        type: Date,
    },
    organization: {
        type: Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    employees: [{
        type: Types.ObjectId,
        ref: 'Employee'
    }],
    scrumMaster: {type: Types.ObjectId, ref: 'Employee', required: true}
}, {
    timestamps: true
})

export const ProjectModel = mongoose.model('Project', projectSchema)