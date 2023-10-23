import joi from 'joi'
import { CUSTOM_FIELDS_SCHEMAS } from '../../constants/schema_validation_fields'
import { IOrganization } from '../../types/organization.types'
import { IImageFile } from '../../types/image.types'

interface ICreateOrgSchema extends Omit<IOrganization, 'logo'|'isVerified'|'isDeleted'>{
    file: IImageFile
}

interface IUpdateOrgSchema extends Omit<ICreateOrgSchema, 'company'> {}

interface IOnlyObjectId {
    orgId: string
}

export const createOrganizationSchema = joi.object<ICreateOrgSchema>({
    organization_name: joi.string().required(),
    company: joi.string().min(3).max(30).required(),
    description: joi.string().min(3).max(300),
    headQuarters: joi.string().min(2).max(20).required(),
    file: CUSTOM_FIELDS_SCHEMAS.file,
    industry: joi.string().valid('software development'),
}).required()

export const getOrgByIdSchema = joi.object<IOnlyObjectId>({
    orgId: CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required()

export const updateOrganizationSchema = joi.object<IUpdateOrgSchema>({
    organization_name: joi.string(),
    description: joi.string().min(3).max(300),
    headQuarters: joi.string().min(2).max(20),
    file: CUSTOM_FIELDS_SCHEMAS.file,
    industry: joi.string().valid('software development'),
})