import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { createTaskSchema } from './task.validation';
import {
	authEmployee,
	authScrumMaster,
} from '../../middlewares/authentication';
import { asyncHandler } from '../../utils/errHandling';
import { createTask } from './task.controller';

const router = Router();
router.post(
	'/createtask/:scrumId',
	authEmployee,
	authScrumMaster,
	validate(createTaskSchema),
	asyncHandler(createTask)
);

export default router;
