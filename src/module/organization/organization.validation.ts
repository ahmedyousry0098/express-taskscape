import joi from 'joi'
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields'
import { IOrganization } from '../../types/organization.types'
import { IImageFile } from '../../types/image.types'

interface ICreateOrgSchema extends Omit<IOrganization, 'logo'|'isVerified'|'isDeleted'>{
    file: IImageFile
}

interface IUpdateOrgSchema extends Omit<ICreateOrgSchema, 'company'> {
    orgId: string
}

interface IOnlyObjectId {
    orgId: string
}

export const createOrganizationSchema = joi.object<ICreateOrgSchema>({
    organization_name: joi.string().required().messages({
        'string.base': 'Organization name must be a string.',
        'any.required': 'Organization name is required.'
    }),
    company: joi.string().min(3).max(30).required().messages({
        'string.base': 'Company name must be a string.',
        'string.min': 'Company name must be at least {#limit} characters long.',
        'string.max': 'Company name cannot exceed {#limit} characters.',
        'any.required': 'Company name is required.'
    }),
    description: joi.string().min(3).max(300).messages({
        'string.base': 'Description must be a string.',
        'string.min': 'Description must be at least {#limit} characters long.',
        'string.max': 'Description cannot exceed {#limit} characters.'
    }),
    headQuarters: joi.string().min(2).max(20).required().messages({
        'string.base': 'Headquarters must be a string.',
        'string.min': 'Headquarters must be at least 2 characters long.',
        'string.max': 'Headquarters cannot exceed 20 characters.',
        'any.required': 'Headquarters is required.'
    }),
    file: CUSTOM_FIELDS_SCHEMAS.file,
    industry: joi.string().valid('software development'),
}).required()

export const getOrgByIdSchema = joi.object<IOnlyObjectId>({
    orgId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const updateOrganizationSchema = joi.object<IUpdateOrgSchema>({
    organization_name: joi.string().messages({
        'string.base': 'Organization name must be a string.'
    }),
    description: joi.string().min(3).max(300).messages({
        'string.base': 'Description must be a string.',
        'string.min': 'Description must be at least {#limit} characters long.',
        'string.max': 'Description cannot exceed {#limit} characters.'
    }),
    headQuarters: joi.string().min(2).max(20).messages({
        'string.base': 'Headquarters must be a string.',
        'string.min': 'Headquarters must be at least 2 characters long.',
        'string.max': 'Headquarters cannot exceed 20 characters.',
        'any.required': 'Headquarters is required.'
    }),
    file: CUSTOM_FIELDS_SCHEMAS.file,
    industry: joi.string().valid('software development'),
    orgId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
})