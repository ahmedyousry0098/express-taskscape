import Joi, { date } from "joi";
import { IProject } from "../../types/project.types";
import { CUSTOM_FIELDS_SCHEMAS } from "../../constants/schema_validation_fields";

interface ICreateProjectSchema extends IProject {}
interface IEmpoyeesToProjectSchema {
    organization: string;
    project: string;
}
interface IAddEmpoyeesToProjectSchema extends IEmpoyeesToProjectSchema {
    employees: string[];
}
interface IRemoveEmpoyeesFromProjectSchema extends IEmpoyeesToProjectSchema {
    employee: string;
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

export const createProjectSchema = Joi.object<ICreateProjectSchema>({
    projectName: Joi.string().required(),
    description: Joi.string(),
    startDate: Joi.date().greater(Date.now()),
    deadline: Joi.date().greater(Date.now()),
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

export const getOrgProjectsSchema = Joi.object<IOrgId>({
    orgId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const getEmpProjectsSchema = Joi.object<IEmpId>({
    empId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const getScrumProjectsSchema = Joi.object<IScrumId>({
    scrumId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()
