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
	getOrgScrums,
} from './employee.controller';
import {
	authAdmin,
	authEmployee,
	authScrumMaster,
	isAdminOrScrum,
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

router.post(
	'/login', 
	validate(loginAdminSchema), 
	asyncHandler(employeeLogin)
);

router.patch(
	'/changepassword/:employeeId',
	authEmployee,
	validate(changePasswordSchema),
	asyncHandler(employeeChangePassword)
);
router.get(
	'/getAllEmployees/:orgId',
	validate(getOrgByIdSchema),
	isAdminOrScrum,
	asyncHandler(getAllEmployee)
);
router.get(
	'/getAllScrums/:orgId',
	validate(getAllEmployeeForScrumSchema),
	authAdmin,
	asyncHandler(getOrgScrums)
);

export default router;
