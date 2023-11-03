import { Router } from "express";
import { authEmployee, authScrumMaster, isAdminOrScrum, systemAuth } from "../../middlewares/authentication";
import { validate } from "../../middlewares/validate";
import { asyncHandler } from "../../utils/errHandling";
import { createSprint, getProjectSprints, sprintDetails } from "./sprint.controller";
import { createSprintSchema, getProjectSprintsSchema, getSprintDetailsSchema } from "./sprint.validation";

const router = Router()

router.post(
    '/create/:projectId',
    validate(createSprintSchema),
    authEmployee,
    authScrumMaster,
    asyncHandler(createSprint)
)

router.get(
    '/:projectId',
    validate(getProjectSprintsSchema),
    systemAuth,
    asyncHandler(getProjectSprints)
)

router.get(
    '/details/:sprintId',
    validate(getSprintDetailsSchema),
    systemAuth,
    asyncHandler(sprintDetails)
)
export default router