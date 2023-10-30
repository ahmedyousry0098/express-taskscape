import { RequestHandler, Request, Response, NextFunction } from "express";
import { ProjectModel, ProjectSchemaType } from "../../../DB/model/project.model";
import { ResponseError } from "../../utils/errHandling";
import { OrganizationSchemaType } from "../../../DB/model/organization.model";
import { SprintModel, SprintSchemaType } from "../../../DB/model/sprint.model";
import { ERROR_MESSAGES } from "../../constants/error_messages";
import { TaskModel } from "../../../DB/model/task.model";

export const createSprint: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {projectId} = req.params
    const project = await ProjectModel.findOne<ProjectSchemaType>
    (
        {
            _id: projectId, 
        }
    ).populate<OrganizationSchemaType>(
        'organization'
    ).orFail(
        new Error(`Project\'s Organization not exist`)
    )
    if (!project) {
        return next(new ResponseError(
            'sprint\'s project dosen\'t exist please check organization and project id or create new project'
        ))
    }
    const sprint = new SprintModel({
        ...req.body,
        project: projectId
    })
    if (!await sprint.save()) {
        return new ResponseError(`${ERROR_MESSAGES.serverErr}`)
    }
    return res.status(201).json({message: 'sprint created successfully'})
}

export const getProjectSprints: RequestHandler = async (req, res, next) => {
    const {projectId} = req.params
    const project = await ProjectModel.findById<ProjectSchemaType>(projectId)
    if (!project) {
        return next(new ResponseError('Sprint\'s Project is not exist', 400))
    }
    const cursor = SprintModel.find<SprintSchemaType>({
        project: project._id
    }).cursor()
    
    let sprints = []
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        const tasks = await TaskModel.find({sprint: doc._id}).populate([
            {
                path: 'assignTo',
                select: '-password -organization -lastChangePassword'
            }
        ])
        sprints.push({...doc, tasks})
    }
    return res.status(200).json({message: 'all project sprints', sprints})
}