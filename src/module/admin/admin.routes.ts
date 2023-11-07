import { Router } from 'express';
import { changeAdminPassword, createAdmin, forgetPassword, login, resetPassword } from './admin.controller';
import { asyncHandler } from '../../utils/errHandling';
import { validate } from '../../middlewares/validate';
import { registerAdminSchema, loginAdminSchema, forgetPasswordSchema, resetPasswordSchema } from './admin.validation';
import { authAdmin } from '../../middlewares/authentication';
import { changePasswordSchema } from '../employee/employee.validation';
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields';
import { getOrgByIdSchema } from '../organization/organization.validation';

const router: Router = Router();

router.post(
	'/register',
	validate(registerAdminSchema),
	asyncHandler(createAdmin)
);

router.post(
	'/login', 
	validate(loginAdminSchema), 
	asyncHandler(login)
);

router.patch(
	`/forget-password`,
	validate(forgetPasswordSchema),
	asyncHandler(forgetPassword)
);

router.patch(
	`/reset-password`,
	validate(resetPasswordSchema),
	asyncHandler(resetPassword)
);

router.patch(
	'/changepassword',
	validate(changePasswordSchema),
	authAdmin,
	asyncHandler(changeAdminPassword)
);

export default router;
