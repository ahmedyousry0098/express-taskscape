import { Router } from "express";
import { authEmployee, authScrumMaster, isAdminOrScrum } from "../../middlewares/authentication";
import { validate } from "../../middlewares/validate";
import { asyncHandler } from "../../utils/errHandling";
import { createSprint, getProjectSprints } from "./sprint.controller";
import { createSprintSchema, getProjectSprintsSchema } from "./sprint.validation";

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
    // authEmployee,
    asyncHandler(getProjectSprints)
)

export default router