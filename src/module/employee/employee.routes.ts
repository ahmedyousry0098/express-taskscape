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
	getAllEmployee,
} from './employee.controller';
import { authAdmin, authEmployee } from '../../middlewares/authentication';
import { loginAdminSchema } from '../admin/admin.validation';
import { getOrgByIdSchema } from '../organization/organization.validation';

const router: Router = Router();

router.post(
	'/createmployee',
	authAdmin,
	validate(createEmployeeSchema),
	asyncHandler(createEmployee)
);

router.post('/login', validate(loginAdminSchema), asyncHandler(employeeLogin));

router.patch(
	'/changepassword/:employeeId',
	authEmployee,
	validate(changePasswordSchema),
	asyncHandler(employeeChangePassword)
);
router.get(
	'/getAllEmployee/:orgId',
	validate(getOrgByIdSchema),
	authAdmin,
	asyncHandler(getAllEmployee)
);

export default router;
