import { NextFunction, RequestHandler, Request, Response } from 'express';
import {
	EmployeeModel,
	EmployeeSchemaType,
} from '../../../DB/model/employee.model';
import { ResponseError } from '../../utils/errHandling';
import { ERROR_MESSAGES } from '../../constants/error_messages';
import { sendMail } from '../../utils/sendMail';
import { notificationMailTemp } from '../../utils/mail_templates/notification_employee_mail';
import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { AdminModel, AdminSchemaType } from '../../../DB/model/admin.model';
import { UserRole } from '../../constants/user.role';

export const createEmployee: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const admin = await AdminModel.findById<AdminSchemaType>(req.user?._id);
	const { email, employeeName, password, role } = req.body;

	const employeeIsExist = await EmployeeModel.findOne<EmployeeSchemaType>({
		email,
	});
	if (employeeIsExist) {
		return next(
			new ResponseError(`${ERROR_MESSAGES.conflict('Employee account')}`, 409)
		);
	}
	const newEmployee = new EmployeeModel({
		...req.body,
		createdBy: admin?._id,
		organization: admin?.organization,
	});

	let adminName = admin?.adminName;
	const mailInfo = await sendMail({
		to: newEmployee.email,
		subject: 'Taskspace Access Notification',
		html: notificationMailTemp({
			to: newEmployee.email,
			employeeName,
			password,
			role,
			adminName,
		}),
	});

	if (!mailInfo.accepted.length) {
		return next(new ResponseError('Cannot Send Mail Please Try Again', 500));
	}
	if (!(await newEmployee.save())) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`, 500));
	}

	return res
		.status(200)
		.json({ message: 'Employee added successfully!!', newEmployee });
};

export const employeeLogin: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body;
	const employee = await EmployeeModel.findOne<EmployeeSchemaType>({ email });

	if (!employee) {
		return next(new ResponseError('In-valid credentials', 400));
	}
	if (!compareSync(password, employee.password)) {
		return next(new ResponseError('In-valid password', 400));
	}

	const token = sign(
		{
			_id: employee._id?.toString(),
			email: employee.email,
			role: employee.role,
			orgId: employee.organization.toString(),
		},
		`${process.env.JWT_SIGNATURE}`,
		{ expiresIn: 60 * 60 * 24 }
	);
	return res.status(200).json({ message: 'Done', token });
};

export const employeeChangePassword: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const employeeId = req.params.employeeId;
	const employee = await EmployeeModel.findById<EmployeeSchemaType>(
		req.user!._id
	);
	if (!employee) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('employee')}`));
	}
	if (employee._id && employee._id.toString() !== employeeId) {
		return next(new ResponseError('In-valid credentials', 400));
	}
	const { password, newPassword } = req.body;
	if (!compareSync(password, employee.password)) {
		return next(new ResponseError('In-valid password', 400));
	}
	employee.password = newPassword;
	employee.lastChangePassword = new Date();
	if (!(await employee.save())) {
		return new ResponseError(`${ERROR_MESSAGES.serverErr}`);
	}
	const token = sign(
		{
			_id: employee._id!.toString(),
			email: employee.email,
			role: employee.role,
			orgId: employee.organization.toString(),
		},
		`${process.env.JWT_SIGNATURE}`,
		{ expiresIn: 60 * 60 * 24 }
	);
	return res
		.status(200)
		.json({ message: 'Password changed successfully!!', token });
};

export const getAllEmployee: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const orgId = req.params.orgId;
	const employee = await EmployeeModel.find<EmployeeSchemaType>({
		organization: orgId,
	});

	if (!employee || !employee.length) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('employee')}`));
	}
	return res
		.status(200)
		.json({ message: 'All employee in this organization: ', employee });
};
export const getAllEmployeeForScrum: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const orgId = req.params.orgId;
	const scrumMaster = await EmployeeModel.findById<EmployeeSchemaType>(
		req.user?._id
	);

	const organization = scrumMaster?.organization;
	if (!organization || organization.toString() !== orgId) {
		return next(new ResponseError('You dont authriezed to this organization'));
	}
	const employee = await EmployeeModel.find<EmployeeSchemaType>({
		organization: orgId,
		role: UserRole.EMPLOYEE,
	});

	if (!employee || !employee.length) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('employee')}`));
	}
	return res
		.status(200)
		.json({ message: 'All employee members in this organization: ', employee });
};
