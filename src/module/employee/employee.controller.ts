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
import { ProjectModel } from '../../../DB/model/project.model';
import cloudinary from '../../utils/cloudinary';
import { resetPassowrdTemplate } from '../../utils/mail_templates/reset_password';
import { generateRandomString } from '../../utils/randomCode';

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
		return next(new ResponseError('Cannot Send Verification Mail Please Try Again', 500));
	}
	const savedEmployee = await newEmployee.save()
	if (!savedEmployee) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`, 500));
	}
	return res
		.status(200)
		.json({ message: 'Employee added successfully!!', employee: {...savedEmployee.toJSON(), password: undefined, projects: []} });
};

export const employeeLogin: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body;
	const employee = await EmployeeModel.findOne<EmployeeSchemaType>({ email })

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
	const emp = employee.toJSON()
	delete emp.password
	return res.status(200).json({ message: 'Logged In Successfully', token, employee: emp });
};

export const forgetPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const {email} = req.body
	const user = await EmployeeModel.findOne({email})
	if (!user) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('User')}`, 400))
	}
	const code = generateRandomString(5)
	user.resetPasswordCode = code
	const mailInfo = await sendMail({
		to: user.email,
		subject: 'reset password',
		html: resetPassowrdTemplate(user.employeeName, code)
	})
	if (!mailInfo.accepted.length) {
		return next(new ResponseError(`${ERROR_MESSAGES.unavailableService}`))
	}
	if (!await user.save()) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`))
	}
	return res.status(200).json({message: 'Please Check Your Mail, Reset Password Code Sended There'})
}

export const resetPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const {code, newPassword, email} = req.body
	const account = await EmployeeModel.findOne({email})
	if (!account) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('User')}`, 400))
	}
	if (account.resetPasswordCode != code) {
		return next(new ResponseError(`In-valid reset password code`, 400))
	}
	account.password = newPassword
	account.resetPasswordCode = undefined
	if (!account.save()) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`))
	}
	return res.status(200).json({message: 'password changed successfully'})
}

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
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('employee')}`, 400));
	}
	if (employee._id && employee._id.toString() !== employeeId) {
		return next(new ResponseError('Sorry, Only Account Owner Have Permission To Change Account Password', 401));
	}
	const { password, newPassword } = req.body;
	if (!compareSync(password, employee.password)) {
		return next(new ResponseError('In-valid password', 401));
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

export const changeEmployeeStatus: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const {empId} = req.params
	const user = req.user
	if (user?._id != empId) {
		return next(new ResponseError('Cannot Access and Change Other Employee Profile', 401))
	}
	const employee = await EmployeeModel.findById<EmployeeSchemaType>(empId)
	if (!employee) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('Employee')}`, 400))
	}
	if (!employee?.isFresh) {
		return next(new ResponseError(`This Employee Already Not Fresh`, 400))
	}
	employee.isFresh = false
	if (!await employee.save()) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`))
	}
	return res.status(200).json({message: 'Employee Updated Successfully'})
}

export const getAllEmployee: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const orgId = req.params.orgId;
	const user = req.user
	if (user!.organization !== orgId) {
		return next(new ResponseError('Sorry Cannot Access This Organization information Since You don\'t belong To It', 401));
	}
	const cursor = EmployeeModel.find<EmployeeSchemaType>({
		organization: orgId,
		role: UserRole.EMPLOYEE,
	}).select('-password').cursor()

	let employees = []
	for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
		const projects = await ProjectModel.find({employees: {$in: doc._id}}).select('description projectName')
		employees.push({...doc.toJSON(), projects})
	}
	if (!employees.length) {
		return res.status(200).json({message: 'No employees founded in this orgaization'})
	}
	return res
		.status(200)
		.json({ message: 'All employee in this organization: ', employees });
};

export const getOrgScrums: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const orgId = req.params.orgId
	const user = req.user

	if (user!.organization !== orgId) {
		return next(new ResponseError('Sorry Cannot Access This Organization information Since You don\'t belong To It', 401));
	}
	const cursor = EmployeeModel.find<EmployeeSchemaType>({
		organization: orgId,
		role: UserRole.SCRUM_MASTER,
	}).select('-password').cursor()

	let scrums = []
	for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
		const projects = await ProjectModel.find({employees: {$in: doc._id}}).select('description projectName')
		scrums.push({...doc.toJSON(), projects})
	}
	if (!scrums.length) {
		return res.status(200).json({message: 'No employees founded in this orgaization'})
	}
	return res
		.status(200)
		.json({ message: 'All employee members in this organization: ', scrums });
};

export const updateEmployeePhoto: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const {employeeId} = req.params
	const user = req.user
	const employee = await EmployeeModel.findById<EmployeeSchemaType>(employeeId)
	if (!employee) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('Employee')}`, 400))
	}
	if (employeeId !== user!._id) {
		return next(new ResponseError('You don\'t have permisson to update other employees profile photos'))
	}
	const {public_id, secure_url} = await cloudinary.uploader.upload(
		req.file!.path,
		{
			folder: `${process.env.APP_TITLE}/org`,
			public_id: `emp_${employee._id?.toString()}`,
		},
	)
	if (!public_id || !secure_url) {
		return next(new ResponseError(`Cannot update photo, please try again`))
	}

	const updatedEmp = await EmployeeModel.findByIdAndUpdate(
		employeeId, {profile_photo: {secure_url,public_id}}, { new: true }
	).select('-password')
	if (!updatedEmp) {
		return new ResponseError(`${ERROR_MESSAGES.serverErr}`)
	}
	return res.status(200).json({message: 'profile photo updated successfully', employee: updatedEmp})
}

export const getMe: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	const user = req.user
	const employee = await EmployeeModel.findById(user!._id).select('-password')
	return res.status(200).json({employee})
}

export const deleteEmployee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const {empId} = req.params
	const user = req.user
	const employee = await EmployeeModel.findOne<EmployeeSchemaType>({
		_id: empId,
		role: UserRole.EMPLOYEE
	})
	if (!employee) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('Employee')}`, 400))
	}
	if (employee.organization.toString() != user!.organization) {
		return next(
			new ResponseError('Sorry, You Don\'t Have Permission To This Organization Projects Since You Don\'t It\'s Admin', 401 )
		)
	}
	const deletedEmp = await EmployeeModel.updateOne(
		{_id: empId},
		{isDeleted: true},
	)
	if (!deletedEmp.modifiedCount) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`))
	}
	return res.status(200).json({message: `Employee (${employee.employeeName}) deleted successfully`})
}