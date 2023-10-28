import { NextFunction, RequestHandler, Request, Response } from 'express';
import {
	ProjectModel,
	ProjectSchemaType,
} from '../../../DB/model/project.model';
import { TaskModel, TaskSchemaType } from '../../../DB/model/task.model';
import { ResponseError } from '../../utils/errHandling';
import { ERROR_MESSAGES } from '../../constants/error_messages';
import { UserRole } from '../../constants/user.role';
import {
	CommentModel,
	CommentSchemaType,
} from '../../../DB/model/comment.model';

export const addComment: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const employee = req.user;
	const task = await TaskModel.findById<TaskSchemaType>(req.params.taskId);
	if (!task) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('task')}`));
	}
	const project = await ProjectModel.findById<ProjectSchemaType>(
		task.project.toString()
	);
	if (!project) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('project')}`));
	}

	const employeeInProject = project.employees.some(
		(emp) => emp.toString() === employee?._id
	);

	if (
		(employee?.role === UserRole.SCRUM_MASTER &&
			employee._id !== project.scrumMaster.toString()) ||
		(employee?.role === UserRole.EMPLOYEE && !employeeInProject)
	) {
		return next(
			new ResponseError('You are not authorized to add a comment', 403)
		);
	}
	const comment = new CommentModel({
		text: req.body.text,
		assignToTask: task._id,
		auther: employee?._id,
	});
	if (!(await comment.save())) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`));
	}
	return res
		.status(200)
		.json({ message: 'Comment added Successfully...', comment });
};

export const editComment: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const commentId = req.params.commentId;
	const employee = req.user;

	const comment = await CommentModel.findById<CommentSchemaType>(commentId);

	if (!comment) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('comment')}`));
	}
	const task = await TaskModel.findById<TaskSchemaType>(comment.assignToTask);
	if (!task) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('task')}`));
	}
	const project = await ProjectModel.findById<ProjectSchemaType>(
		task.project.toString()
	);
	if (!project) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('project')}`));
	}

	if (employee?._id !== comment.auther.toString()) {
		return next(
			new ResponseError('You are not authorized to edit this comment', 403)
		);
	}
	comment.text = req.body.text;
	if (!(await comment.save())) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`));
	}
	return res
		.status(200)
		.json({ message: 'Comment edited Successfully...', comment });
};
