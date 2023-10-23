"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const errHandling_1 = require("./errHandling");
const uploadFile = (allowedFiles) => {
    const storage = multer_1.default.diskStorage({});
    const fileFilter = (req, file, cb) => {
        if (allowedFiles.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new errHandling_1.ResponseError('in-valid format', 400));
        }
    };
    return (0, multer_1.default)({ storage, fileFilter });
};
exports.uploadFile = uploadFile;
