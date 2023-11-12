import Joi, { date } from "joi";
import { IProject } from "../../types/project.types";
import { CUSTOM_FIELDS_SCHEMAS } from "../../constants/schema_validation_fields";

interface ICreateProjectSchema extends IProject {}
interface IEmployeesToProjectSchema {
    organization: string;
    project: string;
}
interface IAddEmpoyeesToProjectSchema extends IEmployeesToProjectSchema {
    employees: string[];
}
interface IRemoveEmpoyeesFromProjectSchema extends IEmployeesToProjectSchema {
    employee: string;
}
interface IUpdateProjectSchema {
    projectName: string;
    description: string;
    startDate: Date;
    deadline: Date;
    projectId: string
}
interface IOrgId {
    orgId: string
}
interface IEmpId {
    empId: string
}
interface IScrumId {
    scrumId: string
}
interface IProjectId {
    projectId: string
}

export const createProjectSchema = Joi.object<ICreateProjectSchema>({
    projectName: Joi.string().required(),
    description: Joi.string(),
    startDate: Joi.date().min(new Date().toLocaleDateString()).messages({
		'date.base': 'Start Date must be a valid date.',
		'date.min': 'Start Date must be later than or equal to today.'
	}),
    deadline: Joi.date().greater(Joi.ref('startDate')).messages({
        'date.base': 'Deadline must be a valid date.',
        'date.greater': 'Deadline must be later than the start date.'
    }),
    organization: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
    scrumMaster: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
    employees: Joi.array().items(CUSTOM_FIELDS_SCHEMAS.objectId).required()
}).required()

export const addEmpoyeesToProjectSchema = Joi.object<IAddEmpoyeesToProjectSchema>({
    organization: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
    employees: Joi.array().items(CUSTOM_FIELDS_SCHEMAS.objectId.required()).required(),
    project: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required()

export const removeEmpoyeesFromProjectSchema = Joi.object<IRemoveEmpoyeesFromProjectSchema>({
    organization: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
    employee: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
    project: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
}).required()

export const updateProjectSchema = Joi.object<IUpdateProjectSchema>({
    projectName: Joi.string(),
    description: Joi.string(),
    startDate: Joi.date().min(new Date().toLocaleDateString()).messages({
		'date.base': 'Start Date must be a valid date.',
		'date.min': 'Start Date must be later than or equal to today.'
	}),
    deadline: Joi.date().greater(Joi.ref('startDate')).messages({
        'date.base': 'Deadline must be a valid date.',
        'date.greater': 'Deadline must be later than the start date.'
    }),
    projectId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const getOrgProjectsSchema = Joi.object<IOrgId>({
    orgId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const getEmpProjectsSchema = Joi.object<IEmpId>({
    empId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const getScrumProjectsSchema = Joi.object<IScrumId>({
    scrumId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const getProjectDetailsSchema = Joi.object<IProjectId>({
    projectId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const deleteProjectSchema = Joi.object<IProjectId>({
    projectId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()