import { Router } from "express";
import { authAdmin, authEmployee, authScrumMaster, isAdminOrScrum, systemAuth } from "../../middlewares/authentication";
import { asyncHandler } from "../../utils/errHandling";
import { addEmployeeToProject, createProject, deleteProject, getEmployeeProjects, getOrgProjects, getScrumProjects, projectDetails, removeEmployeeFromProject, updateProject } from "./project.controller";
import { validate } from "../../middlewares/validate";
import { addEmpoyeesToProjectSchema, createProjectSchema, deleteProjectSchema, getEmpProjectsSchema, getOrgProjectsSchema, getProjectDetailsSchema, getScrumProjectsSchema, removeEmpoyeesFromProjectSchema, updateProjectSchema } from "./project.validation";

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

router.put(
    '/update/:projectId',
    validate(updateProjectSchema),
    isAdminOrScrum,
    asyncHandler(updateProject)
)

router.get(
    '/org-projects/:orgId',
    validate(getOrgProjectsSchema),
    isAdminOrScrum,
    asyncHandler(getOrgProjects)
)

router.get(
    '/emp-projects/:empId',
    validate(getEmpProjectsSchema),
    systemAuth,
    asyncHandler(getEmployeeProjects)
)

router.get(
    '/scrum-projects/:scrumId',
    validate(getScrumProjectsSchema),
    isAdminOrScrum,
    asyncHandler(getScrumProjects)
)

router.get(
    '/details/:projectId',
    validate(getProjectDetailsSchema),
    systemAuth,
    asyncHandler(projectDetails)
)

router.delete(
    '/:projectId',
    validate(deleteProjectSchema),
    authAdmin,
    asyncHandler(deleteProject)
)

export default router