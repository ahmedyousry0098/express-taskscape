import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import {
	createTaskSchema,
	updateStatusSchema,
	updateTaskSchema,
} from './task.validation';
import {
	authEmployee,
	authScrumMaster,
} from '../../middlewares/authentication';
import { asyncHandler } from '../../utils/errHandling';
import { createTask, updateStatus, updateTask } from './task.controller';

const router = Router();
router.post(
	'/createtask/:scrumId',
	authEmployee,
	authScrumMaster,
	validate(createTaskSchema),
	asyncHandler(createTask)
);

router.patch(
	'/updatetask/:taskId',
	authEmployee,
	authScrumMaster,
	validate(updateTaskSchema),
	asyncHandler(updateTask)
);

router.patch(
	'/updatestatus/:taskId',
	authEmployee,
	validate(updateStatusSchema),
	asyncHandler(updateStatus)
);
export default router;
