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
exports.authEmployee = exports.authAdmin = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const admin_model_1 = require("../../DB/model/admin.model");
const errHandling_1 = require("../utils/errHandling");
const employee_model_1 = require("../../DB/model/employee.model");
const authAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.headers;
    if (!token) {
        return res.status(401).json({ message: 'Please provide a token' });
    }
    const decoded = (0, jsonwebtoken_1.verify)(`${token}`, `${process.env.JWT_SIGNATURE}`);
    const admin = yield admin_model_1.AdminModel.findById(decoded._id).populate('organization').orFail();
    if (!admin) {
        return next(new errHandling_1.ResponseError('In-valid credentials', 406));
    }
    req.admin = admin;
    next();
});
exports.authAdmin = authAdmin;
const authEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.headers;
    if (!token) {
        return res.status(401).json({ message: 'Please provide a token' });
    }
    const decoded = (0, jsonwebtoken_1.verify)(`${token}`, `${process.env.JWT_SIGNATURE}`);
    const employee = yield employee_model_1.EmployeeModel.findById(decoded._id);
    if (!employee) {
        return next(new errHandling_1.ResponseError('In-valid credentials', 406));
    }
    if (new Date(decoded.iat * 1000) < employee.lastChangePassword) {
        return next(new errHandling_1.ResponseError('Token is invalid', 401));
    }
    req.employee = employee;
    next();
});
exports.authEmployee = authEmployee;
