import { RequestHandler, Request, Response, NextFunction } from "express";
import { ProjectModel, ProjectSchemaType } from "../../../DB/model/project.model";
import { ResponseError } from "../../utils/errHandling";
import { OrganizationSchemaType } from "../../../DB/model/organization.model";
import { SpringModel } from "../../../DB/model/sprint.model";
import { ERROR_MESSAGES } from "../../constants/error_messages";

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
    const sprint = new SpringModel({
        ...req.body,
        project: projectId
    })
    if (!await sprint.save()) {
        return new ResponseError(`${ERROR_MESSAGES.serverErr}`)
    }
    return res.status(201).json({message: 'sprint created successfully'})
}