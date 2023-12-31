import { NextFunction, Request, RequestHandler, Response } from 'express';
import {
	AdminModel,
	AdminSchemaType,
	IAdminWithOrg,
} from '../../../DB/model/admin.model';
import {
	OrganizationModel,
	OrganizationSchemaType,
} from '../../../DB/model/organization.model';
import { ResponseError } from '../../utils/errHandling';
import { ERROR_MESSAGES } from '../../constants/error_messages';
import { sendMail } from '../../utils/sendMail';
import { confirmMailTemp } from '../../utils/mail_templates/confirm_mail';
import { sign } from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import { UserRole } from '../../constants/user.role';
import { generateRandomString } from '../../utils/randomCode';
import { resetPassowrdTemplate } from '../../utils/mail_templates/reset_password';

export const createAdmin: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, organization } = req.body;
	const adminExist = await AdminModel.findOne<AdminSchemaType>({ email });
	if (adminExist) {
		return next(
			new ResponseError(`${ERROR_MESSAGES.conflict('admin account')}`, 409)
		);
	}
	const org = await OrganizationModel.findById(organization);
	if (!org) {
		return next(new ResponseError('organization not exist'));
	}
	const newAdmin = new AdminModel({ ...req.body, organization });
	const token = sign(
		{
			_id: org._id.toString(),
			email: newAdmin.email,
		},
		`${process.env.JWT_SIGNATURE}`,
		{ expiresIn: 60 * 60 * 24 }
	);
	const confirmationLink = `${req.protocol}://${req.headers.host}/organization/${token}/confirm-organization`;
	const mailInfo = await sendMail({
		to: newAdmin.email,
		subject: 'Confirm Taskspace Organization',
		html: confirmMailTemp({ to: newAdmin.email, confirmationLink }),
	});
	if (!mailInfo.accepted.length) {
		return new ResponseError(`${ERROR_MESSAGES.unavailableService}`);
	}
	if (!(await newAdmin.save())) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`));
	}
	return res
		.status(201)
		.json({ message: 'Please checkout your mail to confirm your account' });
};

export const login: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body;
	const admin = await AdminModel.findOne<AdminSchemaType>({ email });
	if (!admin) {
		return next(new ResponseError('In-valid credentials', 400));
	}
	if (!compareSync(password, admin.password)) {
		return next(new ResponseError('In-valid credentials', 400));
	}
	const org = await OrganizationModel.findById<OrganizationSchemaType>(
		admin.organization
	);
	if (!org || org.isDeleted) {
		return next(
			new ResponseError(`${ERROR_MESSAGES.notFound('Organization')}`)
		);
	}
	if (!org.isVerified) {
		const token = sign(
			{
				_id: admin._id!.toString(),
				email: admin.email,
			},
			`${process.env.JWT_SIGNATURE}`,
			{ expiresIn: 60 * 60 * 24 }
		);
		const confirmationLink = `${req.protocol}://${req.headers.host}/organization/${token}/confirm-organization`;
		const mailInfo = await sendMail({
			to: admin.email,
			subject: 'Confirm Taskspace Organization',
			html: confirmMailTemp({ to: admin.email, confirmationLink }),
		});
		if (!mailInfo.accepted.length) {
			return next(new ResponseError(`${ERROR_MESSAGES.unavailableService}`));
		}
		return next(
			new ResponseError(
				'Organization not verified yet, please check your mail to verify it'
			)
		);
	}
	const token = sign(
		{
			_id: admin._id!.toString(),
			email: admin.email,
			role: UserRole.ADMIN,
			orgId: admin.organization.toString()
		},
		`${process.env.JWT_SIGNATURE}`,
		{ expiresIn: 60 * 60 * 24 }
	);
	const adm = admin.toJSON()
	delete adm.password
	return res.status(200).json({ message: 'logged In Successfully', token, admin: adm });
};

export const forgetPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const {email} = req.body
	const user = await AdminModel.findOne({email})
	if (!user) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('User')}`, 400))
	}
	const code = generateRandomString(5)
	user.resetPasswordCode = code
	const mailInfo = await sendMail({
		to: user.email,
		subject: 'reset password',
		html: resetPassowrdTemplate(user.adminName, code)
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
	const account = await AdminModel.findOne({email})
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

export const changeAdminPassword: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const admin = await AdminModel.findById<AdminSchemaType>(req.user!._id);
	if (!admin) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('admin')}`));
	}
	const { password, newPassword } = req.body;
	if (!compareSync(password, admin!.password)) {
		return next(new ResponseError('In-valid password', 400));
	}
	admin.password = newPassword;
	admin.lastChangePassword = new Date();
	if (!(await admin.save())) {
		return new ResponseError(`${ERROR_MESSAGES.serverErr}`);
	}
	const token = sign(
		{
			_id: admin._id!.toString(),
			email: admin.email,
			role: UserRole.ADMIN,
			orgId: admin.organization.toString()
		},
		`${process.env.JWT_SIGNATURE}`,
		{ expiresIn: 60 * 60 * 24 }
	);
	return res
		.status(200)
		.json({ message: 'Password changed successfully!!', token });
};
