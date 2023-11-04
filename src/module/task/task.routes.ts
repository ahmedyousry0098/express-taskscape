import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import {
	createTaskSchema,
	getEmployeeTasksSchema,
	getScrumTasksSchema,
	updateStatusSchema,
	updateTaskSchema,
} from './task.validation';
import {
	authEmployee,
	authScrumMaster,
	isAdminOrScrum,
	systemAuth,
} from '../../middlewares/authentication';
import { asyncHandler } from '../../utils/errHandling';
import { createTask, getEmployeeTasks, getScrumsTasks, updateStatus, updateTask } from './task.controller';

const router = Router();
router.post(
	'/createtask/:sprintId',
	// validate(createTaskSchema),
	authEmployee,
	authScrumMaster,
	asyncHandler(createTask)
);

router.patch(
	'/updatetask/:taskId',
	validate(updateTaskSchema),
	authEmployee,
	authScrumMaster,
	asyncHandler(updateTask)
);

router.patch(
	'/updatestatus/:taskId',
	validate(updateStatusSchema),
	authEmployee,
	asyncHandler(updateStatus)
);

router.get(
	'/emp-tasks/:empId',
	validate(getEmployeeTasksSchema),
	systemAuth,
	asyncHandler(getEmployeeTasks)
)

router.get(
	'/scrum-tasks/:scrumId',
	validate(getScrumTasksSchema),
	isAdminOrScrum,
	asyncHandler(getScrumsTasks)
)

export default router;
