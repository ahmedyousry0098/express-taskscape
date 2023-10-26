import { Router } from 'express';
import { changeAdminPassword, createAdmin, login } from './admin.controller';
import { asyncHandler } from '../../utils/errHandling';
import { validate } from '../../middlewares/validate';
import { registerAdminSchema, loginAdminSchema } from './admin.validation';
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
router.post('/login', validate(loginAdminSchema), asyncHandler(login));
router.patch(
	'/changepassword',
	validate(changePasswordSchema),
	authAdmin,
	asyncHandler(changeAdminPassword)
);

export default router;
