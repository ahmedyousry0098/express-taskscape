import { NextFunction, RequestHandler, Request, Response } from 'express';
import { verify, Secret, JwtPayload } from 'jsonwebtoken';
import { AdminModel, AdminSchemaType } from '../../DB/model/admin.model';
import {
	OrganizationModel,
	OrganizationSchemaType,
} from '../../DB/model/organization.model';
import { ResponseError } from '../utils/errHandling';
import { ERROR_MESSAGES } from '../constants/error_messages';
import { IAdmin } from '../types/admin.types';
import { IOrganization } from '../types/organization.types';

// interface AdminAuthentication extends IAdmin {
// 	organization: OrganizationSchemaType;
// }
interface AdminAuthentication extends IAdmin {}

declare module 'express' {
	interface Request {
		user?: AdminAuthentication;
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

	const decoded = verify(
		`${token}`,
		`${process.env.JWT_SIGNATURE}`
	) as JwtPayload;

	const admin = await AdminModel.findById<AdminSchemaType>(
		decoded._id
	).populate('organization');
	if (!admin) {
		return next(new ResponseError('In-valid credentials'));
	}

	// const org = await OrganizationModel.findById<OrganizationSchemaType>(
	// 	admin.organization
	// );
	// if (!org || org.isDeleted) {
	// 	return next(
	// 		new ResponseError(`${ERROR_MESSAGES.notFound('Organization')}`)
	// 	);
	// }
	req.user = admin;
};
