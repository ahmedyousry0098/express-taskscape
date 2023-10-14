import joi from 'joi'
import { IImageFile } from '../types/image.types'
import mongoose from 'mongoose'

export const CUSTOM_FIELDS_SCHEMAS = {
    objectId: joi.string().custom((value) => {
        return mongoose.Types.ObjectId.isValid(value) ? true : false
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
}