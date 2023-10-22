import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { createEmployeeSchema } from './employee.validation';
import { asyncHandler } from '../../utils/errHandling';
import { createEmployee } from './employee.controller';
import { authAdmin } from '../../middlewares/authentication';

const router: Router = Router();

router.post(
	'/createmployee',
	authAdmin,
	validate(createEmployeeSchema),
	asyncHandler(createEmployee)
);

export default router;
