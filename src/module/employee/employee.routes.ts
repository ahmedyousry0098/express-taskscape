import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import {
	changeEmpStatusSchema,
	changePasswordSchema,
	createEmployeeSchema,
	deleteEmployeeSchema,
	forgetPasswordSchema,
	getAllEmployeeForScrumSchema,
	replaceEmployeeSchema,
	replaceScrumSchema,
	resetPasswordSchema,
	updateProfilePhotoSchema,
} from './employee.validation';
import { asyncHandler } from '../../utils/errHandling';
import {
	changeEmployeeStatus,
	createEmployee,
	deleteAndReplaceEmployee,
	deleteAndReplaceScrum,
	deleteEmployee,
	employeeChangePassword,
	employeeLogin,
	forgetPassword,
	getAllEmployee,
	getMe,
	getOrgScrums,
	resetPassword,
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
	`/forget-password`,
	validate(forgetPasswordSchema),
	asyncHandler(forgetPassword)
);

router.patch(
	`/reset-password`,
	validate(resetPasswordSchema),
	asyncHandler(resetPassword)
);

router.patch(
	'/changepassword/:employeeId',
	authEmployee,
	validate(changePasswordSchema),
	asyncHandler(employeeChangePassword)
);

router.patch(
	'/change-status/:empId',
	validate(changeEmpStatusSchema),
	authEmployee,
	asyncHandler(changeEmployeeStatus)
)

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

router.patch(
	'/delete/:empId',
	validate(deleteEmployeeSchema),
	authAdmin,
	asyncHandler(deleteEmployee)
)

router.patch(
	'/del-and-replace-emp/:remEmpId',
	validate(replaceEmployeeSchema),
	authAdmin,
	asyncHandler(deleteAndReplaceEmployee)
)

router.patch(
	'/del-and-replace-scrum/:remScrumId',
	validate(replaceScrumSchema),
	authAdmin,
	asyncHandler(deleteAndReplaceScrum)
)
export default router;
