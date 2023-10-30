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
import { SprintModel, SprintSchemaType } from '../../../DB/model/sprint.model';

export const createTask: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const {sprintId} = req.params;
	const scrumId = req.user!._id;
	const { assignTo, project: projectId } = req.body;

	const project = await ProjectModel.findById<ProjectSchemaType>(projectId)
	if(!project) {
		return next(new ResponseError('Project is not exist', 400))
	}
	const sprint = await SprintModel.findOne<SprintSchemaType>({
		_id: sprintId,
		project: projectId
	})
	if (!sprint) {
		return next(new ResponseError(`${ERROR_MESSAGES.notFound('Sprint')}`, 400));
	}
	const assignToEmployee = await EmployeeModel.find<EmployeeSchemaType>({
		_id: assignTo,
		role: UserRole.EMPLOYEE,
	})
	if (!assignToEmployee) {
		return next(new ResponseError(`Assigned To Employee is not exist`, 400));
	}

	const empIds = project.employees.map((emp) => emp.toString())

	if (!empIds.includes(assignTo)) {
		return next(
			new ResponseError('This member is not assigned to this project', 400)
		);
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
	const { taskName, description, deadline, status } = req.body;

	const task = await TaskModel.findById<TaskSchemaType>({
		_id: taskId,
	})
	if (!task) {
		return next(new ResponseError(ERROR_MESSAGES.notFound('task')));
	}
	if (task.scrumMaster.toString() !== req.user!._id) {
		return next(
			new ResponseError('You are not authorized to update this task', 403)
		);
	}
	const project = await ProjectModel.findById<ProjectSchemaType>(task.project);

	if (!project) {
		return next(
			new ResponseError(
				'This project does not more exist or a member is not assigned to this project',
				404
			)
		);
	}

	if (req.body.assignTo) {
		const assignToEmployee = await EmployeeModel.findOne<EmployeeSchemaType>({
			_id: req.body.assignTo,
			role: UserRole.EMPLOYEE,
		});
		if (!assignToEmployee) {
			return next(new ResponseError('assigned to employee is not exist'));
		}

		const empIds = project.employees.map((emp) => emp.toString())

		if (!empIds.includes(req.body.assignTo)) {
			return next(
				new ResponseError('This member is not assigned to this project', 400)
			);
		}
	}

	const updatedTask = await TaskModel.findByIdAndUpdate<TaskSchemaType>(
		taskId,
		req.body,
		{ new: true }
	);

	if (!updatedTask) {
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
	if (task.assignTo.toString() !== req.user!._id) {
		return next(
			new ResponseError('You are not authorized to update this task', 403)
		);
	}
	const updateStatus = await TaskModel.findByIdAndUpdate<TaskSchemaType>(
		taskId,
		status,
		{ new: true }
	);
	if (!updateStatus) {
		return next(new ResponseError(ERROR_MESSAGES.serverErr));
	}
	return res
		.status(200)
		.json({ message: 'Status updated Successfully...', updateStatus });
};

export const getEmployeeTasks: RequestHandler = async (req, res, next) => {
	const {empId} = req.params
	const employee = await EmployeeModel.findById<EmployeeSchemaType>(empId)
	if (!employee) {
		return next(new ResponseError('Employee Is Not Exist', 400))
	}
	const tasks = await TaskModel.find<TaskSchemaType>({assignTo: empId}).populate([
		{
			path: 'sprint',
			select: '-project'
		},
		{
			path: 'project',
			select: '*organization -employees',
			populate: {
				path: 'scrumMaster',
				select: 'employeeName'
			}
		}
	])
	if (!tasks) {
		return res.status(200).json({message: 'No tasks Found'})
	}
	return res.status(200).json({message: 'employee tasks:', tasks})
}