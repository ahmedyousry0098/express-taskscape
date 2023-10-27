import { NextFunction, RequestHandler, Request, Response } from 'express';
import {
	EmployeeModel,
	EmployeeSchemaType,
} from '../../../DB/model/employee.model';
import { ResponseError } from '../../utils/errHandling';
import {
	ProjectModel,
	ProjectSchemaType,
} from '../../../DB/model/project.model';
import { ERROR_MESSAGES } from '../../constants/error_messages';
import { UserRole } from '../../constants/user.role';
import { TaskModel, TaskSchemaType } from '../../../DB/model/task.model';

export const createTask: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const scrumId = req.params.scrumId;
	const scrumMaster = req.user;

	if (scrumMaster?._id && scrumMaster?._id.toString() !== scrumId) {
		return next(new ResponseError('In-valid credintals', 400));
	}

	const { project, assignTo } = req.body;
	const projectIsExist = await ProjectModel.findById<ProjectSchemaType>({
		_id: project,
	});
	if (!projectIsExist) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound}`));
	}
	const projectEmployees = projectIsExist.employees.map((emp) =>
		emp.toString()
	);

	if (!projectEmployees.includes(assignTo)) {
		return next(
			new ResponseError('This member is not assigned to this project')
		);
	}

	const assignToEmployee = await EmployeeModel.find<EmployeeSchemaType>({
		_id: assignTo,
		role: UserRole.EMPLOYEE,
	});
	if (!assignToEmployee) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`));
	}

	const task = new TaskModel({
		...req.body,
		scrumMaster: scrumId,
	});
	if (!(await task.save())) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`));
	}
	return res.status(200).json({ message: 'Task added Successfully...', task });
};

export const updateTask: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const taskId = req.params.taskId;
	const { taskName, description, deadline, assignTo, status } = req.body;

	const task = await TaskModel.findById<TaskSchemaType>({
		_id: taskId,
	});
	if (!task) {
		return next(new ResponseError(ERROR_MESSAGES.notFound('task')));
	}
	if (task.scrumMaster.toString() !== req.user?._id) {
		return next(
			new ResponseError('You are not authorized to update this task', 403)
		);
	}
	const project = await ProjectModel.findById<ProjectSchemaType>(task.project);

	if (!project || !project.employees.includes(assignTo)) {
		return next(
			new ResponseError(
				'This project does not more exist or a member is not assigned to this project',
				404
			)
		);
	}
	const assignToEmployee = await EmployeeModel.findById<EmployeeSchemaType>({
		_id: assignTo,
	});
	if (!assignToEmployee || assignToEmployee.role !== UserRole.EMPLOYEE) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`));
	}
	const updatedTask = await TaskModel.findByIdAndUpdate<TaskSchemaType>(
		taskId,
		req.body,
		{ new: true }
	);

	if (!(await updatedTask!.save())) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`));
	}
	return res
		.status(200)
		.json({ message: 'Task updated Successfully...', updatedTask });
};

export const updateStatus: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const taskId = req.params.taskId;
	const status = req.body;
	const task = await TaskModel.findById<TaskSchemaType>({
		_id: taskId,
	});
	if (!task) {
		return next(new ResponseError(ERROR_MESSAGES.notFound('task')));
	}
	if (task.assignTo.toString() !== req.user?._id) {
		return next(
			new ResponseError('You are not authorized to update this task', 403)
		);
	}
	const updateStatus = await TaskModel.findByIdAndUpdate<TaskSchemaType>(
		taskId,
		status,
		{ new: true }
	);
	if (!updateStatus!.save()) {
		return next(new ResponseError(ERROR_MESSAGES.serverErr));
	}
	return res
		.status(200)
		.json({ message: 'Status updated Successfully...', updateStatus });
};
