import { NextFunction, RequestHandler, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AdminModel, AdminSchemaType, IAdminWithOrg } from '../../DB/model/admin.model';
import { ResponseError, asyncHandler } from '../utils/errHandling';
import { IJwtPayload } from '../interfaces/jwt.interface';
import { EmployeeModel, EmployeeSchemaType } from '../../DB/model/employee.model';
import { OrganizationSchemaType } from '../../DB/model/organization.model';

declare module 'express' {
	interface Request {
		admin?: IAdminWithOrg;
		employee?: EmployeeSchemaType; 
	}
}

export const authAdmin: RequestHandler = asyncHandler(async (
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
	) as IJwtPayload;
	const admin = await AdminModel.findById<AdminSchemaType>(decoded._id).populate<{organization: OrganizationSchemaType}>(
		'organization'
	).orFail(new Error('Admin\'s Organization Not Found'))
	if (!admin) {
		return next(new ResponseError('In-valid credentials', 406));
	}
	if (new Date(decoded.iat! * 1000) < admin.lastChangePassword) {
		return next(new ResponseError('Token is invalid', 401));
	}
	req.admin = admin;
	next();
});

export const authEmployee: RequestHandler = asyncHandler(async (
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
	) as IJwtPayload;
	const employee = await EmployeeModel.findById<EmployeeSchemaType>(decoded._id);
	if (!employee) {
		return next(new ResponseError('In-valid credentials', 406));
	}
	if (new Date(decoded.iat! * 1000) < employee.lastChangePassword) {
		return next(new ResponseError('Token is invalid', 401));
	}
	req.employee = employee;
	next();
});
