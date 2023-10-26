import { NextFunction, Request, RequestHandler, Response } from "express";
import { OrganizationModel, OrganizationSchemaType } from "../../../DB/model/organization.model";
import { ResponseError } from "../../utils/errHandling";
import { EmployeeModel, EmployeeSchemaType } from "../../../DB/model/employee.model";
import { UserRole } from "../../constants/user.role";
import { ERROR_MESSAGES } from "../../constants/error_messages";
<<<<<<< HEAD
import { ProjectModel, ProjectSchemaType } from "../../../DB/model/project.model";
=======
import { ProjectModel } from "../../../DB/model/project.model";
>>>>>>> 6f86d7781db8ca7c2336e33bbf23cb7097331142

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

export const addEmployeeToProject: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {employees, organization, project} = req.body
    const org = await OrganizationModel.findById({_id: organization})
    if (!org) return next(new ResponseError(`${ERROR_MESSAGES.notFound('Organization')}`))
    const FoundedProject = await ProjectModel.findOne<ProjectSchemaType>({_id: project, organization})
    if (!FoundedProject) {
        return next(new ResponseError('Sorry This Project doesn\'t exist in this organization', 400))
    }
    const foundedEmployees = await EmployeeModel.find<EmployeeSchemaType>(
        {
            _id: {$in: employees},
            organization
        }
    )
    if (!foundedEmployees) {
        return next(new ResponseError(`Sorry These Employees doesn\'t exist in this Organization`, 400))
    }
    if (foundedEmployees.length < employees.length)
    {
        const empIds = foundedEmployees.map(emp => emp._id?.toString())
        const missingEmployees = (employees as string[]).filter((id: string) => !empIds.includes(id)).join(", ")
        return next(new ResponseError(`Sorry ${missingEmployees} (employees id) are not exist in this organization`, 400))
    }
    FoundedProject.employees.push(...employees)
    if (!await FoundedProject.save()) {
        return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`))
    }
    return res.status(200).json({message: 'done', project: FoundedProject})
}

export const removeEmployeeFromProject: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {employee, organization, project} = req.body
    const org = await OrganizationModel.findById({_id: organization})
    if (!org) return next(new ResponseError(`${ERROR_MESSAGES.notFound('Organization')}`, 400))
    const foundedEmployee = await EmployeeModel.findOne<EmployeeSchemaType>(
        {
            _id: employee,
            organization
        }
    )
    if (!foundedEmployee) {
        return next(new ResponseError(`Sorry These Employees doesn\'t exist in this Organization`, 400))
    }
    const foundedProject = await ProjectModel.findOne<ProjectSchemaType>({_id: project, organization})
    if (!foundedProject) {
        return next(new ResponseError('Sorry This Project doesn\'t exist in this organization', 400))
    }
    if (!foundedProject.employees.includes(foundedEmployee._id!)) {
        return next(new ResponseError('Sorry This Employee doesn\'t exist in this project', 400))
    }
    const updatedProject = await ProjectModel.updateOne(
        {
            _id: employee,
            organization
        }, 
        {
            $pull: {employees: employee}
        },
        {multi: true, new: true}
    )
    if (!updatedProject.matchedCount) {
        return next(`${ERROR_MESSAGES.serverErr}`)
    }
    return res.status(200).json({message: 'done', project: updatedProject})
}