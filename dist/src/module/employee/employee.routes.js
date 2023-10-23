"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../../middlewares/validate");
const employee_validation_1 = require("./employee.validation");
const errHandling_1 = require("../../utils/errHandling");
const employee_controller_1 = require("./employee.controller");
const authentication_1 = require("../../middlewares/authentication");
const admin_validation_1 = require("../admin/admin.validation");
const router = (0, express_1.Router)();
router.post('/createmployee', authentication_1.authAdmin, (0, validate_1.validate)(employee_validation_1.createEmployeeSchema), (0, errHandling_1.asyncHandler)(employee_controller_1.createEmployee));
router.post('/login', (0, validate_1.validate)(admin_validation_1.loginAdminSchema), (0, errHandling_1.asyncHandler)(employee_controller_1.employeeLogin));
router.patch('/changepassword', authentication_1.authEmployee, (0, validate_1.validate)(employee_validation_1.changePasswordSchema), (0, errHandling_1.asyncHandler)(employee_controller_1.employeeChangePassword));
exports.default = router;
//
