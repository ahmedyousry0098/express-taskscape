"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeChangePassword = exports.employeeLogin = exports.createEmployee = void 0;
const employee_model_1 = require("../../../DB/model/employee.model");
const errHandling_1 = require("../../utils/errHandling");
const error_messages_1 = require("../../constants/error_messages");
const sendMail_1 = require("../../utils/sendMail");
const notification_employee_mail_1 = require("../../utils/mail_templates/notification_employee_mail");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const createEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = req.admin;
    const { email, employeeName, password, role } = req.body;
    const employeeIsExist = yield employee_model_1.EmployeeModel.findOne({
        email,
    });
    if (employeeIsExist) {
        return next(new errHandling_1.ResponseError(`${error_messages_1.ERROR_MESSAGES.conflict('Employee account')}`, 409));
    }
    const newEmployee = new employee_model_1.EmployeeModel(Object.assign(Object.assign({}, req.body), { createdBy: admin === null || admin === void 0 ? void 0 : admin.id, organization: admin === null || admin === void 0 ? void 0 : admin.organization }));
    let adminName = admin === null || admin === void 0 ? void 0 : admin.adminName;
    const mailInfo = yield (0, sendMail_1.sendMail)({
        to: newEmployee.email,
        subject: 'Taskspace Access Notification',
        html: (0, notification_employee_mail_1.notificationMailTemp)({
            to: newEmployee.email,
            employeeName,
            password,
            role,
            adminName,
        }),
    });
    if (mailInfo.accepted.length) {
        return next(new errHandling_1.ResponseError('Cannot Send Mail Please Try Again', 500));
    }
    if (!(yield newEmployee.save())) {
        return next(new errHandling_1.ResponseError(`${error_messages_1.ERROR_MESSAGES.serverErr}`, 500));
    }
    return res
        .status(200)
        .json({ message: 'Employee added successfully!!', newEmployee });
});
exports.createEmployee = createEmployee;
const employeeLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    const employee = yield employee_model_1.EmployeeModel.findOne({ email });
    if (!employee) {
        return next(new errHandling_1.ResponseError('In-valid credentials', 400));
    }
    if (!(0, bcryptjs_1.compareSync)(password, employee.password)) {
        return next(new errHandling_1.ResponseError('In-valid password', 400));
    }
    const token = (0, jsonwebtoken_1.sign)({
        _id: (_a = employee._id) === null || _a === void 0 ? void 0 : _a.toString(),
        email: employee.email,
        role: employee.role,
    }, `${process.env.JWT_SIGNATURE}`, { expiresIn: 60 * 60 * 24 });
    return res.status(200).json({ message: 'Done', token });
});
exports.employeeLogin = employeeLogin;
const employeeChangePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = req.employee;
    const { password, newPassword } = req.body;
    if (!(0, bcryptjs_1.compareSync)(password, employee.password)) {
        return next(new errHandling_1.ResponseError('In-valid password', 400));
    }
    employee.password = newPassword;
    employee.lastChangePassword = new Date();
    yield employee.save();
    return res.status(200).json({ message: 'Password changed successfully!!' });
});
exports.employeeChangePassword = employeeChangePassword;
