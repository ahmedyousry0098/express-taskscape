import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { createTaskSchema } from './task.validation';
import { isAdminOrScrum } from '../../middlewares/authentication';
import { asyncHandler } from '../../utils/errHandling';

const router = Router();
router.post(
	'/task/:scrumId',
	validate(createTaskSchema),
	isAdminOrScrum,
	asyncHandler
);
