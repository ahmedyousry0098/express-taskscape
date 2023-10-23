import { Router } from 'express';
import { createAdmin, login } from './admin.controller';
import { asyncHandler } from '../../utils/errHandling';
import { validate } from '../../middlewares/validate';
import { registerAdminSchema, loginAdminSchema } from './admin.validation';

const router: Router = Router();

router.post(
	'/register',
	validate(registerAdminSchema),
	asyncHandler(createAdmin)
);
router.post('/login', validate(loginAdminSchema), asyncHandler(login));

export default router;
