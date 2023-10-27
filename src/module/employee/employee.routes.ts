import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import {
	changePasswordSchema,
	createEmployeeSchema,
	getAllEmployeeForScrumSchema,
} from './employee.validation';
import { asyncHandler } from '../../utils/errHandling';
import {
	createEmployee,
	employeeChangePassword,
	employeeLogin,
	getAllEmployee,
	getAllEmployeeForScrum,
} from './employee.controller';
import {
	authAdmin,
	authEmployee,
	authScrumMaster,
} from '../../middlewares/authentication';
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
router.get(
	'/getAllEmployeeScrum/:scrumId',
	validate(getAllEmployeeForScrumSchema),
	authEmployee,
	authScrumMaster,
	asyncHandler(getAllEmployeeForScrum)
);

export default router;
