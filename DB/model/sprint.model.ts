import mongoose, {InferSchemaType, Schema, Types} from "mongoose";
import { ISprint } from "../../src/types/sprint.types";

export type SprintSchemaType = InferSchemaType<typeof sprintSchema>
interface ISpringDocument extends mongoose.Document<typeof Types.ObjectId>, ISprint {}

const sprintSchema = new Schema<ISpringDocument>({
    sprint_name: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        default: new Date(),
    },
    deadline: {
        type: Date,
        required: false
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project',
        required: true
    },
    organization: {
        type: Types.ObjectId,
        ref: 'Organization',
    }
}, {
    timestamps: true
})

export const SprintModel = mongoose.model<ISpringDocument>('Sprint', sprintSchema)