import { Request } from 'express'
import multer, {FileFilterCallback, Multer} from 'multer'
import { ResponseError } from './errHandling'

export const uploadFile = (allowedFiles: string[]): Multer => {
    const storage = multer.diskStorage({})
    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (allowedFiles.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new ResponseError('in-valid format', 400))
        }
    }
    
    return multer({storage, fileFilter})
}