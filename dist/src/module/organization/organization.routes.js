"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadFile_1 = require("../../utils/uploadFile");
const organization_controller_1 = require("./organization.controller");
const errHandling_1 = require("../../utils/errHandling");
const file_categories_1 = require("../../constants/file_categories");
const validate_1 = require("../../middlewares/validate");
const organization_validation_1 = require("./organization.validation");
const router = (0, express_1.Router)();
router.post('/', (0, uploadFile_1.uploadFile)(file_categories_1.filesCategoriesSchema.images).single('logo'), (0, validate_1.validate)(organization_validation_1.createOrganizationSchema), (0, errHandling_1.asyncHandler)(organization_controller_1.createOrganization));
router.get('/:orgId', (0, validate_1.validate)(organization_validation_1.getOrgByIdSchema), (0, errHandling_1.asyncHandler)(organization_controller_1.getOrganizationById));
router.get('/:token/confirm-organization', (0, errHandling_1.asyncHandler)(organization_controller_1.confirmOrganization));
exports.default = router;
