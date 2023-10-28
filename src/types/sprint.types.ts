import { Types } from "mongoose";

export interface ISprint {
    sprint_name: string;
    start_date: Date;
    deadline: Date;
    project: typeof Types.ObjectId;
    tasks: typeof Types.ObjectId;
    organization: typeof Types.ObjectId
}