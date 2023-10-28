import { Router } from "express";
import { authEmployee, authScrumMaster, isAdminOrScrum } from "../../middlewares/authentication";
import { validate } from "../../middlewares/validate";
import { asyncHandler } from "../../utils/errHandling";

const router = Router()

router.post(
    '/create/:projectId',
    // validate(),
    authEmployee,
    authScrumMaster,
    asyncHandler
)

export default router