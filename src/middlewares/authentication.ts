import { NextFunction, RequestHandler, Request, Response } from 'express';
import { verify, Secret } from 'jsonwebtoken';
import { AdminModel, AdminSchemaType } from '../../DB/model/admin.model';
import {
	OrganizationModel,
	OrganizationSchemaType,
} from '../../DB/model/organization.model';
import { ResponseError } from '../utils/errHandling';
import { ERROR_MESSAGES } from '../constants/error_messages';
interface JwtToken {
	_id: string;
	email: string;
}
declare module 'express' {
	interface Request {
		admin?: AdminSchemaType;
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

	const jwtSecret = process.env.JWT_SIGNATURE;

	if (!jwtSecret) {
		return res.status(500).json({ message: 'JWT secret is not defined' });
	}

	const decoded = verify(
		Array.isArray(token) ? token[0] : token,
		jwtSecret as Secret
	) as JwtToken;

	const admin = await AdminModel.findById<AdminSchemaType>(decoded._id);
	if (!admin) {
		return new ResponseError('In-valid credentials');
	}
	const org = await OrganizationModel.findById<OrganizationSchemaType>(
		admin.organization
	);
	if (!org || org.isDeleted) {
		return next(
			new ResponseError(`${ERROR_MESSAGES.notFound('Organization')}`)
		);
	}
	req.admin = admin;
};
