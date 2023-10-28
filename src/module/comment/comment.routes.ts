import { Router } from 'express';
import { authEmployee } from '../../middlewares/authentication';
import { validate } from '../../middlewares/validate';
import { addCommentSchema, editCommentSchema } from './comment.validation';
import { asyncHandler } from '../../utils/errHandling';
import { addComment, editComment } from './comment.controller';

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
export default router;
