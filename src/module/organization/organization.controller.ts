import { NextFunction, Request, RequestHandler, Response } from "express";
import { OrganizationModel } from "../../../DB/model/organization.model";
import { ResponseError } from "../../utils/errHandling";
import { ERROR_MESSAGES } from "../../constants/error_messages";
import cloudinary from "../../utils/cloudinary";

export const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
    const {company} = req.body
    const existsOrg = await OrganizationModel.findOne({company})
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