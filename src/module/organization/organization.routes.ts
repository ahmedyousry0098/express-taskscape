import { Router } from "express";
import { uploadFile } from "../../utils/uploadFile";
import { createOrganization, getOrganizationById } from "./organization.controller";
import { asyncHandler } from "../../utils/errHandling";
import { filesCategoriesSchema } from "../../constants/file_categories";
import { validate } from "../../middlewares/validate";
import { createOrganizationSchema, getOrganizationSchema } from "./organization.validation";

const router = Router()

router.post(
    '/', 
    uploadFile(filesCategoriesSchema.images).single('logo'), 
    validate(createOrganizationSchema),
    asyncHandler(createOrganization)
)

router.get(
    '/:orgId',
    validate(getOrganizationSchema),
    asyncHandler(getOrganizationById)
)

export default router