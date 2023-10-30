import { NextFunction, RequestHandler, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import {
	AdminModel,
	AdminSchemaType,
	IAdminWithOrg,
} from '../../DB/model/admin.model';
import { ResponseError, asyncHandler } from '../utils/errHandling';
import { IJwtPayload } from '../interfaces/jwt.interface';
import {
	EmployeeModel,
	EmployeeSchemaType,
} from '../../DB/model/employee.model';
import { OrganizationSchemaType } from '../../DB/model/organization.model';
import { UserRole } from '../constants/user.role';

declare module 'express' {
	interface Request {
		user?: {
			_id: string;
			email: string;
			role: UserRole;
			organization: string
		};
	}
}

export const authAdmin: RequestHandler = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { token } = req.headers;

		if (!token) {
			return res.status(401).json({ message: 'Please provide a token' });
		}
		const decoded = verify(
			`${token}`,
			`${process.env.JWT_SIGNATURE}`
		) as IJwtPayload;
		const admin = await AdminModel.findById<AdminSchemaType>(
			decoded._id
		).select('id email organization');
		if (!admin) {
			return next(new ResponseError('In-valid credentials', 406));
		}
		if (new Date(decoded.iat! * 1000) < admin.lastChangePassword) {
			return next(new ResponseError('Token is invalid', 401));
		}
		req.user = {
			_id: admin._id!.toString(),
			email: admin.email,
			role: UserRole.ADMIN,
			organization: admin.organization.toString()
		};

		next();
	}
);

export const authEmployee: RequestHandler = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { token } = req.headers;
		if (!token) {
			return res.status(401).json({ message: 'Please provide a token' });
		}
		const decoded = verify(
			`${token}`,
			`${process.env.JWT_SIGNATURE}`
		) as IJwtPayload;
		const employee = await EmployeeModel.findById<EmployeeSchemaType>(
			decoded._id
		).select('_id email role organization');
		if (!employee) {
			return next(new ResponseError('In-valid credentials', 406));
		}
		if (new Date(decoded.iat! * 1000) < employee.lastChangePassword) {
			return next(new ResponseError('Token is invalid', 401));
		}

		req.user = {
			_id: employee._id!.toString(),
			email: employee.email,
			role: employee.role,
			organization: employee.organization.toString()
		};

		next();
	}
);

export const authScrumMaster: RequestHandler = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user?.role;

		if (user === UserRole.SCRUM_MASTER) {
			next();
		} else {
			return res
				.status(403)
				.json({ message: 'Access denied. User is not a scrumMaster' });
		}
	}
);

export const isAdminOrScrum = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { token } = req.headers;
		if (!token) {
			return res.status(401).json({ message: 'Please provide a token' });
		}
		const decoded = verify(
			`${token}`,
			`${process.env.JWT_SIGNATURE}`
		) as IJwtPayload;
		return decoded.role == UserRole.ADMIN
			? authAdmin(req, res, next)
			: decoded.role == UserRole.SCRUM_MASTER
			? authEmployee(req, res, next)
			: next(new ResponseError("Sorry, You don't have permissions"));
	}
);
