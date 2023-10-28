import { Router } from "express";
import { authEmployee, authScrumMaster, isAdminOrScrum } from "../../middlewares/authentication";
import { validate } from "../../middlewares/validate";
import { asyncHandler } from "../../utils/errHandling";
import { createSprint } from "./sprint.controller";
import { createSprintSchema } from "./sprint.validation";

const router = Router()

router.post(
    '/create/:projectId',
    validate(createSprintSchema),
    authEmployee,
    authScrumMaster,
    asyncHandler(createSprint)
)

export default router