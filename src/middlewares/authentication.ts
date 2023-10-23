import { NextFunction, RequestHandler, Request, Response } from 'express';
import { verify, Secret } from 'jsonwebtoken';
import { AdminModel, IAdminWithOrg } from '../../DB/model/admin.model';
import { ResponseError } from '../utils/errHandling';
import { IJwtPayload } from '../interfaces/jwt.interface';
import { IEmployee } from '../types/employee.types';
import { EmployeeModel } from '../../DB/model/employee.model';

declare module 'express' {
	interface Request {
		admin?: IAdminWithOrg;
	}
}
declare module 'express' {
	interface Request {
		employee?: any;
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
	) as IJwtPayload;
	const admin = await AdminModel.findById<IAdminWithOrg>(decoded._id).populate(
		'organization'
	);
	if (!admin) {
		return next(new ResponseError('In-valid credentials', 406));
	}
	req.admin = admin;
	next();
};

export const authEmployee: RequestHandler = async (
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

	const employee = await EmployeeModel.findById<IEmployee>(decoded._id);

	if (!employee) {
		return next(new ResponseError('In-valid credentials', 406));
	}
	if (new Date(decoded.iat! * 1000) < employee.lastChangePassword) {
		return next(new ResponseError('Token is invalid', 401));
	}
	req.employee = employee;
	next();
};
