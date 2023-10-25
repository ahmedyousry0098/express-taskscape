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
	const scrumMaster = req.employee as EmployeeSchemaType;
	if (scrumMaster._id && scrumMaster._id.toString() !== scrumId) {
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

	const missingAssignments = assignTo.filter(
		(id: string) => !projectEmployees.includes(id)
	);

	if (missingAssignments.length > 0) {
		const missingAssignToIds = missingAssignments.join(',');
		return next(
			new ResponseError(
				`${missingAssignToIds} ids are not assigned to this project`
			)
		);
	}

	const assignToEmployee = await EmployeeModel.find<EmployeeSchemaType>({
		_id: { $in: assignTo },
		role: UserRole.EMPLOYEE,
	});
	if (!assignToEmployee) {
		return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`));
	}

	if (assignToEmployee.length < assignTo.length) {
		const assignToIds = assignToEmployee.map((emp) => emp._id!.toString());
		const missingAssiningTo: string[] = assignTo
			.filter((id: string) => !assignToIds.includes(id))
			.join(',');
		return next(new ResponseError(`${missingAssiningTo} ids are not exist`));
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
