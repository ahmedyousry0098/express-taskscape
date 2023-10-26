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
import { string } from 'joi';
import { TaskModel } from '../../../DB/model/task.model';

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
