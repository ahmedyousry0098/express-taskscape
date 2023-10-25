"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        var _a;
        let requestKeys = Object.assign(Object.assign(Object.assign({}, req.body), req.params), req.query);
        if (req.file || req.files) {
            requestKeys.file = req.file || req.files;
        }
        const result = schema.validate(requestKeys, {
            abortEarly: false,
        });
        let messages = [];
        console.log(requestKeys);
        if ((_a = result.error) === null || _a === void 0 ? void 0 : _a.details) {
            for (let err of result.error.details) {
                messages.push(err.message);
            }
            return res
                .status(400)
                .json({ message: 'validation error', details: messages });
        }
        next();
    };
};
exports.validate = validate;
