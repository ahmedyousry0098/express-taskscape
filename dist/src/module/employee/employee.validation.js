"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.createEmployeeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createEmployeeSchema = joi_1.default.object({
    employeeName: joi_1.default.string().min(3).max(20).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    role: joi_1.default.string().valid('scrumMaster', 'member').required(),
}).required();
exports.changePasswordSchema = joi_1.default.object({
    password: joi_1.default.string().required(),
    newPassword: joi_1.default.string().invalid(joi_1.default.ref('password')).required().message('new password is equal old password!'),
});
