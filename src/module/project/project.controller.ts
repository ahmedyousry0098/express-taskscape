import { NextFunction, Request, RequestHandler, Response } from "express";
import { OrganizationModel, OrganizationSchemaType } from "../../../DB/model/organization.model";
import { ResponseError } from "../../utils/errHandling";
import { EmployeeModel, EmployeeSchemaType } from "../../../DB/model/employee.model";
import { UserRole } from "../../constants/user.role";
import { ERROR_MESSAGES } from "../../constants/error_messages";
import { ProjectModel, ProjectSchemaType } from "../../../DB/model/project.model";
import { SprintModel, SprintSchemaType } from "../../../DB/model/sprint.model";
import { TaskModel, TaskSchemaType } from "../../../DB/model/task.model";

export const createProject: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {organization, scrumMaster, employees} = req.body 
    const user = req.user
    const org = await OrganizationModel.findById<OrganizationSchemaType>({_id: organization})
    if (!org || org.isDeleted) {
        return next(new ResponseError('Cannot assign this project to specific organization', 400))
    }
    if (organization !== user!.organization) {
        return next(new ResponseError('Sorry Cannot Access This Organization information Since You don\'t belong To It', 401));
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
    const savedProject = await (await project.save()).populate([
        {
            path: 'scrumMaster',
            select: '-password -createdBy -organization',
            
        },
        {
            path: 'employees',
            select: '-password -createdBy -organization',
        }
    ])
    if (!savedProject) {
        return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`))
    }
    return res.status(201).json({message: 'project added successfully', project})
}

export const addEmployeeToProject: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {employees, organization, project} = req.body
    const user = req!.user
    const org = await OrganizationModel.findById({_id: organization})
    if (!org) return next(new ResponseError(`${ERROR_MESSAGES.notFound('Organization')}`))
    if (organization !== user!.organization) {
        return next(new ResponseError('Sorry Cannot Access This Organization information Since You don\'t belong To It', 401));
    }
    const FoundedProject = await ProjectModel.findOne<ProjectSchemaType>({_id: project, organization})
    if (!FoundedProject) {
        return next(new ResponseError('Sorry This Project doesn\'t exist in this organization', 400))
    }
    for (let emp of employees) {
        if (FoundedProject.employees.includes(emp)) {
            const existsEmployee = await EmployeeModel.findById(emp).select('employeeName')
            return next(new ResponseError(`${existsEmployee?.employeeName} already exist in this project`, 409))
        }
    }
    const foundedEmployees = await EmployeeModel.find<EmployeeSchemaType>(
        {
            _id: {$in: employees},
            organization
        }
    )
    if (foundedEmployees.length < employees.length)
    {
        const empIds = foundedEmployees.map(emp => emp._id?.toString())
        const missingEmployees = (employees as string[]).filter((id: string) => !empIds.includes(id)).join(", ")
        return next(new ResponseError(`Sorry ${missingEmployees} (employees id) are not exist in this organization`, 400))
    }
    const updatedProject = await ProjectModel.findByIdAndUpdate(
        {_id: project},
        {$addToSet: {employees: {$each: employees}}},
        {new: true}
    )
    if (!updatedProject) {
        return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`))
    }
    return res.status(200).json({message: 'Employees added to project successfully', project: updatedProject})
}

export const removeEmployeeFromProject: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {employee, organization, project} = req.body
    const user = req.user
    const org = await OrganizationModel.findById({_id: organization})
    if (!org) return next(new ResponseError(`${ERROR_MESSAGES.notFound('Organization')}`, 400))
    if (organization !== user!.organization) {
        return next(new ResponseError('Sorry Cannot Access This Organization information Since You don\'t belong To It', 401));
    }
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
    const updatedProject = await ProjectModel.findOneAndUpdate(
        {
            _id: project,
            organization
        }, 
        {
            $pull: {employees: employee}
        },
        {new: true}
    ).populate([
        {
            path: 'scrumMaster',
            select: '-password -createdBy -organization',
            
        },
        {
            path: 'employees',
            select: '-password -createdBy -organization',
        }
    ])
    if (!updatedProject) {
        return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`))
    }
    return res.status(200).json({message: 'employee removed from project successfully', project: updatedProject})
}

export const getOrgProjects: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {orgId} = req.params
    const user = req.user
    if (orgId !== user!.organization) {
        return next(new ResponseError('Sorry Cannot Access This Organization information Since You don\'t belong To It', 401));
    }
    const projects = await ProjectModel.find<OrganizationSchemaType>({organization: orgId}).populate([
        {
            path: 'scrumMaster',
            select: '-password -createdBy -organization',
            
        },
        {
            path: 'employees',
            select: '-password -createdBy -organization',
        },
        {
            path: 'organization'
        }
    ])
    if (!projects) {
        return next(new ResponseError(`${ERROR_MESSAGES.serverErr}`))
    }
    if (!projects.length) {
        return res.status(200).json({message: 'No Projects founded in this organization'})
    }
    return res.status(200).json({projects})
}

export const getEmployeeProjects: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {empId} = req.params
    const employee = await EmployeeModel.findOne<EmployeeSchemaType>({
        _id: empId,
        role: UserRole.EMPLOYEE
    })
    if (!employee) {
        return next(new ResponseError(`${ERROR_MESSAGES.notFound('Employee')}`))
    }
    const projects = await ProjectModel.find({employees: {$in: empId}}).populate([
        {
            path: 'scrumMaster',
            select: 'employeeName email experience workingTime'
        }
    ]).select('-organization -employees')
    return res.status(200).json({message: 'employee\'s projects', projects})
}

export const getScrumProjects: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {scrumId} = req.params
    const scrum = await EmployeeModel.findOne<EmployeeSchemaType>({
        _id: scrumId,
        role: UserRole.SCRUM_MASTER
    })
    if (!scrum) {
        return next(new ResponseError(`${ERROR_MESSAGES.notFound('Scrum')}`))
    }
    const projects = await ProjectModel.find({scrumMaster: {$in: scrumId}}).populate([
        {
            path: 'employees',
            select: 'employeeName email experience workingTime'
        }
    ]).select('-organization')
    return res.status(200).json({message: 'Scrum\'s projects', projects})
}

export const projectDetails: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {projectId} = req.params
    const project = await ProjectModel.findById<ProjectSchemaType>(projectId).populate([
        {
            path: 'employees',
            select: 'employeeName email role profile_photo experience workingTime'
        },
        {
            path: 'scrumMaster',
            select: 'employeeName email role profile_photo experience workingTime'
        }
    ])
    if (!project) {
        return next(new ResponseError(`${ERROR_MESSAGES.notFound('Project')}`, 400))
    }
    const cursor = SprintModel.find<SprintSchemaType>({project: project._id}).cursor()

    let sprints = []
    for (let sprint = await cursor.next(); sprint != null ; sprint = await cursor.next()) {
        const tasks = await TaskModel.find<TaskSchemaType>().populate([
            {
                path: 'assignTo',
                select: 'employeeName email role profile_photo experience workingTime'
            },
            {
                path: 'scrumMaster',
                select: 'employeeName email role profile_photo experience workingTime'
            }
        ])
        sprints.push({...sprint.toJSON(), tasks})
    }
    return res.status(200).json({message: `${project.projectName} (project) details`, details: {...project.toJSON(), sprints}})
}