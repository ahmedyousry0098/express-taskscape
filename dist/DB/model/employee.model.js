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
exports.EmployeeModel = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const employeeSchema = new mongoose_1.Schema({
    employeeName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['scrumMaster', 'member'],
        default: 'member',
    },
    lastChangePassword: { type: Date },
    createdBy: { type: mongoose_1.Types.ObjectId, ref: 'Admin' },
    organization: { type: mongoose_1.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });
employeeSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            const salt = yield (0, bcryptjs_1.genSalt)(Number(process.env.SALT_ROUNDS));
            this.password = yield (0, bcryptjs_1.hash)(this.password, salt);
        }
        next();
    });
});
exports.EmployeeModel = (0, mongoose_1.model)('Employee', employeeSchema);
