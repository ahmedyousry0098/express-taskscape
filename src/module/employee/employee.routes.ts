import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import {
	changePasswordSchema,
	createEmployeeSchema,
	getAllEmployeeForScrumSchema,
	updateProfilePhotoSchema,
} from './employee.validation';
import { asyncHandler } from '../../utils/errHandling';
import {
	createEmployee,
	employeeChangePassword,
	employeeLogin,
	getAllEmployee,
	getMe,
	getOrgScrums,
	updateEmployeePhoto,
} from './employee.controller';
import {
	authAdmin,
	authEmployee,
	authScrumMaster,
	isAdminOrScrum,
} from '../../middlewares/authentication';
import { loginAdminSchema } from '../admin/admin.validation';
import { getOrgByIdSchema } from '../organization/organization.validation';
import { uploadFile } from '../../utils/uploadFile';
import { filesCategoriesSchema } from '../../constants/file_categories';

const router: Router = Router();

router.post(
	'/createmployee',
	validate(createEmployeeSchema),
	authAdmin,
	asyncHandler(createEmployee)
);

router.post(
	'/login', 
	validate(loginAdminSchema), 
	asyncHandler(employeeLogin)
);

router.patch(
	'/changepassword/:employeeId',
	authEmployee,
	validate(changePasswordSchema),
	asyncHandler(employeeChangePassword)
);
router.get(
	'/getAllEmployees/:orgId',
	validate(getOrgByIdSchema),
	isAdminOrScrum,
	asyncHandler(getAllEmployee)
);
router.get(
	'/getAllScrums/:orgId',
	validate(getAllEmployeeForScrumSchema),
	authAdmin,
	asyncHandler(getOrgScrums)
);

router.patch(
	'/update-photo/:employeeId',
	uploadFile(filesCategoriesSchema.images).single('photo'),
	validate(updateProfilePhotoSchema),
	authEmployee,
	asyncHandler(updateEmployeePhoto)
)

router.get(
	'/my-profile',
	authEmployee,
	asyncHandler(getMe)
)

export default router;
