import { Router } from "express";
import { uploadFile } from "../../utils/uploadFile";
import { confirmOrganization, createOrganization, getOrganizationById, updateOrganization } from "./organization.controller";
import { asyncHandler } from "../../utils/errHandling";
import { filesCategoriesSchema } from "../../constants/file_categories";
import { validate } from "../../middlewares/validate";
import { createOrganizationSchema, getOrgByIdSchema, updateOrganizationSchema } from "./organization.validation";
import { authAdmin, systemAuth } from "../../middlewares/authentication";

const router = Router()

router.post(
    '/', 
    uploadFile(filesCategoriesSchema.images).single('logo'), 
    validate(createOrganizationSchema),
    asyncHandler(createOrganization)
)

router.get(
    '/:orgId',
    validate(getOrgByIdSchema),
    authAdmin,
    asyncHandler(getOrganizationById)
)

router.get(
    '/:token/confirm-organization',
    asyncHandler(confirmOrganization)
)

router.put(
    '/:orgId/update',
    uploadFile(filesCategoriesSchema.images).single('logo'),
    validate(updateOrganizationSchema),
    authAdmin,
    asyncHandler(updateOrganization)
)

export default router