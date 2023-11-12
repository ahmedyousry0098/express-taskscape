import joi, { CustomHelpers } from 'joi'
import { IImageFile } from '../types/image.types'
import mongoose from 'mongoose'

export const CUSTOM_FIELDS_SCHEMAS = {
    objectId: joi.string().custom((value: string, helper: CustomHelpers<boolean>) => {
        return mongoose.Types.ObjectId.isValid(value) ? true : helper.message({custom: `${value} is In-valid ObjectId`})
    }),
    file: joi.object<IImageFile>({
        filename: joi.string().required(),
        fieldname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        path: joi.string().required(),
        originalname: joi.string().required(),
        destination: joi.string(),
        size: joi.number().positive().required()
    }),
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).messages({
		'string.pattern.base': 'Password must meet the criteria: at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.',
		'any.required': 'Password is required.'
	}),
    email: joi.string().email().messages({
		'string.base': 'Email must be a string.',
		'string.email': 'Email must be a valid email address.',
		'any.required': 'Email is required.'
	})
}