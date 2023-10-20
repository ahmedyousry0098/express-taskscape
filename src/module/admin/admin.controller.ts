import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminModel, AdminSchemaType } from "../../../DB/model/admin.model";
import { OrganizationModel, OrganizationSchemaType } from "../../../DB/model/organization.model";
import { ResponseError } from "../../utils/errHandling";
import { ERROR_MESSAGES } from "../../constants/error_messages";
import { sendMail } from "../../utils/sendMail";
import { confirmMailTemp } from "../../utils/mail_templates/confirm_mail";
import {sign} from 'jsonwebtoken'

export const createAdmin: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {email, organization} = req.body
    const adminExist = await AdminModel.findOne<AdminSchemaType>({email})
    if (adminExist) {
        return next(new ResponseError(`${ERROR_MESSAGES.conflict('admin account')}`, 409))
    }
    const org = await OrganizationModel.findById(organization)
    if (!org) {
        return next(new ResponseError('organization not exist'))
    }
    const newAdmin = new AdminModel({...req.body, organization})
    const token = sign(
        {
            _id: newAdmin._id.toString(), 
            email: newAdmin.email
        }, 
        `${process.env.TOKEN_SIGNATURE}`,
        {expiresIn: 60*60*24}
    )
    const confirmationLink = `${req.protocol}://${req.headers.host}/organization/${token}/confirm-organization`
    const mailInfo = await sendMail({
        to: newAdmin.email,
        subject: "Confirm Taskspace Organization",
        html: confirmMailTemp({to: newAdmin.email, confirmationLink })
    })
    if (!mailInfo.accepted.length) {
        return new ResponseError(`${ERROR_MESSAGES.unavailableService}`)
    }
    if (!await newAdmin.save()) {
        return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`))
    }
    return res.status(201).json({message: 'Please checkout your mail to confirm your account'})
}
