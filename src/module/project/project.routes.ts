import { Router } from "express";
import { isAdminOrScrum } from "../../middlewares/authentication";
import { asyncHandler } from "../../utils/errHandling";
import { createProject } from "./project.controller";
import { validate } from "../../middlewares/validate";
import { createProjectSchema } from "./project.validation";

const router = Router()

router.post(
    '/create', 
    validate(createProjectSchema),
    isAdminOrScrum, 
    asyncHandler(createProject)
)

export default router