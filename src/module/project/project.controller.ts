import { NextFunction, Request, RequestHandler, Response } from "express";
import { OrganizationModel, OrganizationSchemaType } from "../../../DB/model/organization.model";
import { ResponseError } from "../../utils/errHandling";
import { EmployeeModel, EmployeeSchemaType } from "../../../DB/model/employee.model";
import { UserRole } from "../../constants/user.role";
import { ERROR_MESSAGES } from "../../constants/error_messages";
import { ProjectModel } from "../../../DB/model/project.model";

export const createProject: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {organization, scrumMaster, employees} = req.body 
    const org = await OrganizationModel.findById<OrganizationSchemaType>({_id: organization})
    if (!org || org.isDeleted) {
        return next(new ResponseError('Cannot assign this project to specific organization', 400))
    }
    const scrum = await EmployeeModel.findOne<EmployeeSchemaType>({
        _id: scrumMaster, 
        role: UserRole.SCRUM_MASTER, 
        organization
    })
    if (!scrum) {
        return next(new ResponseError('Scrum Master not exist in this oganization', 400))
    }
    const employeesFounded = await EmployeeModel.find<EmployeeSchemaType>({
        _id: {$in: employees}, 
        role: UserRole.EMPLOYEE, 
        organization
    })
    if (!employeesFounded) {
        return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`))
    }
    if (employeesFounded.length < employees.length) {
        const foundedIds = employeesFounded.map(emp => emp._id!.toString())
        const missingEmployees: string[] = employees.filter((id: string) => !foundedIds.includes(id)).join(", ")
        return next(new ResponseError(`${missingEmployees} ids are not exist`))
    }
    const project = new ProjectModel({
        ...req.body,
    })
    if (!await project.save()) {
        return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`))
    }
    return res.status(201).json({message: 'Done', project})
}