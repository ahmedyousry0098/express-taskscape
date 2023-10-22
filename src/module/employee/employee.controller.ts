import { NextFunction, RequestHandler, Request, Response } from 'express';
import { AdminModel, AdminSchemaType } from '../../../DB/model/admin.model';
import {
	EmployeeModel,
	EmployeeSchemaType,
} from '../../../DB/model/employee.model';
import { ResponseError } from '../../utils/errHandling';
import { ERROR_MESSAGES } from '../../constants/error_messages';
import { sendMail } from '../../utils/sendMail';
import { notificationMailTemp } from '../../utils/mail_templates/notification_employee_mail';

export const createEmployee: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// const { adminId } = req.headers;
	const adminId = req.admin?.id;
	const { email, employeeName, password, role } = req.body;
	const admin = await AdminModel.findById<AdminSchemaType>({ adminId });
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
		createdBy: adminId,
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
