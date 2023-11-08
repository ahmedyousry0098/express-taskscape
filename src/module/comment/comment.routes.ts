import { Router } from 'express';
import { authEmployee, systemAuth } from '../../middlewares/authentication';
import { validate } from '../../middlewares/validate';
import { addCommentSchema, editCommentSchema, getCommentsSchema } from './comment.validation';
import { asyncHandler } from '../../utils/errHandling';
import { addComment, editComment, getTaskComments } from './comment.controller';

const router = Router();
router.post(
	'/addcomment/:taskId',
	authEmployee,
	validate(addCommentSchema),
	asyncHandler(addComment)
);
router.patch(
	'/editcomment/:commentId',
	authEmployee,
	validate(editCommentSchema),
	asyncHandler(editComment)
);
router.get(
	`/:taskId`,
	validate(getCommentsSchema),
	authEmployee,
	asyncHandler(getTaskComments)
)
export default router;
