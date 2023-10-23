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

export const createEmployee: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const admin = req.admin;
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
		createdBy: admin?.id,
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
	await newEmployee.save();

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
	const employee: EmployeeSchemaType = req.employee;

	const { password, newPassword } = req.body;
	if (!compareSync(password, employee!.password)) {
		return next(new ResponseError('In-valid password', 400));
	}
	employee.password = newPassword;
	employee!.lastChangePassword = new Date();
	await employee!.save();
	return res.status(200).json({ message: 'Password changed successfully!!' });
};
