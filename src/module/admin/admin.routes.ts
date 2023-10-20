import {Router} from 'express'
import { createAdmin } from './admin.controller'
import { asyncHandler } from '../../utils/errHandling'
import { validate } from '../../middlewares/validate'
import { CreateAdminSchema } from './admin.validation'

const router: Router = Router()

router.post('/', validate(CreateAdminSchema), asyncHandler(createAdmin))

export default router