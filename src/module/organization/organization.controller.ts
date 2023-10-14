import { NextFunction, Request, RequestHandler, Response } from "express";
import { OrganizationModel, OrganizationSchemaType } from "../../../DB/model/organization.model";
import { ResponseError } from "../../utils/errHandling";
import { ERROR_MESSAGES } from "../../constants/error_messages";
import cloudinary from "../../utils/cloudinary";

export const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
    const {company} = req.body
    const existsOrg = await OrganizationModel.findOne<OrganizationSchemaType>({company})
    if (existsOrg) {
        return next(new ResponseError(ERROR_MESSAGES.conflict('company'), 409))
    }
    const createdOrg = new OrganizationModel(req.body)
    if (req.file) {
        const {public_id, secure_url} = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: `${process.env.APP_TITLE}/org/${createdOrg.company}`
            }
        )        
        if (!public_id || !secure_url) return next(new ResponseError(ERROR_MESSAGES.unavailableService, 503))
        createdOrg.logo = {public_id, secure_url}
    }
    if (!await createdOrg.save()) {
        return next(new ResponseError(ERROR_MESSAGES.serverErr, 500))
    }
    return res.status(201).json({message: 'done', organization: createdOrg})
}

export const getOrganizationById = async (req: Request, res: Response, next: NextFunction) => {
    const {orgId} = req.params
    const org = await OrganizationModel.findById<OrganizationSchemaType>(orgId)
    if (!org || org.isDeleted) {
        return next(new ResponseError(ERROR_MESSAGES.notFound('organization'), 404))
    }
    return res.status(200).json({message: 'done', organization: org})
}