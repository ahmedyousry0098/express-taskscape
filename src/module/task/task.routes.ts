import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { createTaskSchema } from './task.validation';
import { isAdminOrScrum } from '../../middlewares/authentication';
import { asyncHandler } from '../../utils/errHandling';
import { createTask } from './task.controller';

const router = Router();
router.post(
	'/createtask/:scrumId',
	validate(createTaskSchema),
	isAdminOrScrum,
	asyncHandler(createTask)
);

export default router;
