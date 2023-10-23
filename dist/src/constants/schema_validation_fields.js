"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUSTOM_FIELDS_SCHEMAS = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.CUSTOM_FIELDS_SCHEMAS = {
    objectId: joi_1.default.string().custom((value) => {
        return mongoose_1.default.Types.ObjectId.isValid(value) ? true : false;
    }),
    file: joi_1.default.object({
        filename: joi_1.default.string().required(),
        fieldname: joi_1.default.string().required(),
        encoding: joi_1.default.string().required(),
        mimetype: joi_1.default.string().required(),
        path: joi_1.default.string().required(),
        originalname: joi_1.default.string().required(),
        destination: joi_1.default.string(),
        size: joi_1.default.number().positive().required()
    }),
};
