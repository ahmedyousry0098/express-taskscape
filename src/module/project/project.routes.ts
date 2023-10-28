import { Router } from "express";
import { authAdmin, isAdminOrScrum } from "../../middlewares/authentication";
import { asyncHandler } from "../../utils/errHandling";
import { addEmployeeToProject, createProject, getOrgProjects, removeEmployeeFromProject } from "./project.controller";
import { validate } from "../../middlewares/validate";
import { addEmpoyeesToProjectSchema, createProjectSchema, getOrgProjectsSchema, removeEmpoyeesFromProjectSchema } from "./project.validation";

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
    asyncHandler(removeEmployeeFromProject)
)

router.get(
    '/org-projects/:orgId',
    validate(getOrgProjectsSchema),
    isAdminOrScrum,
    asyncHandler(getOrgProjects)
)

export default router