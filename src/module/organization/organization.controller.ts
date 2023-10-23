import { NextFunction, Request, RequestHandler, Response } from "express";
import { OrganizationModel, OrganizationSchemaType } from "../../../DB/model/organization.model";
import { ResponseError } from "../../utils/errHandling";
import { ERROR_MESSAGES } from "../../constants/error_messages";
import cloudinary from "../../utils/cloudinary";
import Jwt from "jsonwebtoken";
import { IJwtPayload } from "../../interfaces/jwt.interface";
import { AdminModel, AdminSchemaType } from "../../../DB/model/admin.model";

export const createOrganization: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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
                folder: `${process.env.APP_TITLE}/org`,
                public_id: `org_${createdOrg._id.toString()}`
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

export const getOrganizationById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {orgId} = req.params
    const org = await OrganizationModel.findById<OrganizationSchemaType>(orgId)
    if (!org || org.isDeleted) {
        return next(new ResponseError(ERROR_MESSAGES.notFound('organization'), 404))
    }
    if (!org.isVerified) {
        return next(new ResponseError('Please Check your mail and verify Organization first'))
    }
    const orgAdmin = await AdminModel.findOne<AdminSchemaType>({organization: org._id})
    return res.status(200).json({message: 'done', organization: org, admin: orgAdmin})
}

export const confirmOrganization: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {token} = req.params
    const decoded = Jwt.verify(token, `${process.env.JWT_SIGNATURE}`) as IJwtPayload
    if (!decoded?._id) {
        return next(new ResponseError('In-valid Authorization Key'))
    }
    const org = await OrganizationModel.findByIdAndUpdate<OrganizationSchemaType>(decoded._id, {isVerified: true}, {new: false})
    if (!org || org.isDeleted) {
        return next(new ResponseError(`${ERROR_MESSAGES.notFound('Organization')}`))
    }
    if (org.isVerified) {
        return next(new ResponseError('Organization Already Verified', 400))
    }
    return res.status(200).json({message: 'Organization Verified Successfully'})
}

export const updateOrganization: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {orgId} = req.params
    const admin = req.admin
    const org = await OrganizationModel.findById<OrganizationSchemaType>(orgId)
    if (!org) {
        return next(new ResponseError(`${ERROR_MESSAGES.notFound('Organization')}`))
    }
    if (org._id?.toString() !== admin?.organization._id?.toString()) {
        return next(new ResponseError(`Sorry, You not organization admin and havn't permissions to modify organization`))
    }
    if (req.file) {
        const {public_id, secure_url} = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: `${process.env.APP_TITLE}/org`,
                public_id: `org_${org._id?.toString()}`
            },
            (err, res) => {
                if (err) {
                    return next(new ResponseError(`Cannot update logo, please try again`))
                }
                return res
            }
        )
        req.body.logo = {public_id, secure_url}
    }
    const updatedOrganization = await OrganizationModel.findByIdAndUpdate<OrganizationSchemaType>
    (
        orgId, 
        {...req.body}, 
        {new: true}
    )
    return res.status(200).json({message: 'Done', updatedOrganization})
}