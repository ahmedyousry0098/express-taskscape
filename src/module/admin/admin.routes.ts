import { Router } from 'express';
import { changeAdminPassword, createAdmin, login } from './admin.controller';
import { asyncHandler } from '../../utils/errHandling';
import { validate } from '../../middlewares/validate';
import { registerAdminSchema, loginAdminSchema } from './admin.validation';
import { authAdmin } from '../../middlewares/authentication';
import { changePasswordSchema } from '../employee/employee.validation';

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
	'/changepassword',
	validate(changePasswordSchema), // من عند الامبلوي مودل كدا خالصين :D
	authAdmin,
	asyncHandler(changeAdminPassword)
);

export default router;
