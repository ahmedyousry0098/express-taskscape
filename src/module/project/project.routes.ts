import { Router } from "express";
import { isAdminOrScrum } from "../../middlewares/authentication";
import { asyncHandler } from "../../utils/errHandling";
import { addEmployeeToProject, createProject } from "./project.controller";
import { validate } from "../../middlewares/validate";
import { addEmpoyeesToProjectSchema, createProjectSchema, removeEmpoyeesFromProjectSchema } from "./project.validation";

const router = Router()

router.post(
    '/create', 
    validate(createProjectSchema),
    isAdminOrScrum, 
    asyncHandler(createProject)
)

router.patch(
    '/add-employee',
    validate(addEmpoyeesToProjectSchema),
    isAdminOrScrum,
    asyncHandler(addEmployeeToProject)
)

router.patch(
    '/del-employee',
    validate(removeEmpoyeesFromProjectSchema),
    isAdminOrScrum,
    asyncHandler
)

export default router