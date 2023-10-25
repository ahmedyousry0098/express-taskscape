import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import {
	changePasswordSchema,
	createEmployeeSchema,
} from './employee.validation';
import { asyncHandler } from '../../utils/errHandling';
import {
	createEmployee,
	employeeChangePassword,
	employeeLogin,
} from './employee.controller';
import { authAdmin, authEmployee } from '../../middlewares/authentication';
import { loginAdminSchema } from '../admin/admin.validation';

const router: Router = Router();

router.post(
	'/createmployee',
	authAdmin,
	validate(createEmployeeSchema),
	asyncHandler(createEmployee)
);

router.post('/login', validate(loginAdminSchema), asyncHandler(employeeLogin));

router.patch(
	'/changepassword',
	authEmployee,
	validate(changePasswordSchema),
	asyncHandler(employeeChangePassword)
);

export default router;
