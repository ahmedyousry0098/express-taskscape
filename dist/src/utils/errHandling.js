"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.asyncHandler = exports.ResponseError = void 0;
class ResponseError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.ResponseError = ResponseError;
const asyncHandler = (Api) => {
    return (req, res, next) => Api(req, res, next).catch((err) => {
        return next(err);
    });
};
exports.asyncHandler = asyncHandler;
const globalErrorHandler = (err, req, res, next) => {
    return res.status(err.statusCode || 500).json({ error: err.message });
};
exports.globalErrorHandler = globalErrorHandler;
