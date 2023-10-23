"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdminSchema = exports.registerAdminSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const schema_validation_fields_1 = require("../../constants/schema_validation_fields");
exports.registerAdminSchema = joi_1.default.object({
    adminName: joi_1.default.string().min(3).max(20).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    organization: schema_validation_fields_1.CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required();
exports.loginAdminSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
