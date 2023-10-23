"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrgByIdSchema = exports.createOrganizationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const schema_validation_fields_1 = require("../../constants/schema_validation_fields");
exports.createOrganizationSchema = joi_1.default.object({
    organization_name: joi_1.default.string().required(),
    company: joi_1.default.string().min(3).max(30).required(),
    description: joi_1.default.string().min(3).max(300),
    headQuarters: joi_1.default.string().min(2).max(20).required(),
    file: schema_validation_fields_1.CUSTOM_FIELDS_SCHEMAS.file,
    industry: joi_1.default.string().valid('software development'),
}).required();
exports.getOrgByIdSchema = joi_1.default.object({
    orgId: schema_validation_fields_1.CUSTOM_FIELDS_SCHEMAS.objectId.required()
}).required();
