import { NextFunction, RequestHandler, Request, Response } from 'express';
import { verify, Secret } from 'jsonwebtoken';
import { AdminModel, AdminSchemaType, IAdminWithOrg } from '../../DB/model/admin.model';
import {
	OrganizationModel,
	OrganizationSchemaType,
} from '../../DB/model/organization.model';
import { ResponseError } from '../utils/errHandling';
import { ERROR_MESSAGES } from '../constants/error_messages';
import { IJwtPayload } from '../interfaces/jwt.interface';

declare module 'express' {
	interface Request {
		admin?: IAdminWithOrg;
	}
}

export const authAdmin: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { token } = req.headers;
	if (!token) {
		return res.status(401).json({ message: 'Please provide a token' });
	}
	const decoded = verify(`${token}`, `${process.env.JWT_SIGNATURE}`) as IJwtPayload;
	const admin = await AdminModel.findById<IAdminWithOrg>(decoded._id).populate('organization')
	if (!admin) {
		return next(new ResponseError('In-valid credentials', 406))
	}
	req.admin = admin
};
