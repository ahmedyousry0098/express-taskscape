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
exports.login = exports.createAdmin = void 0;
const admin_model_1 = require("../../../DB/model/admin.model");
const organization_model_1 = require("../../../DB/model/organization.model");
const errHandling_1 = require("../../utils/errHandling");
const error_messages_1 = require("../../constants/error_messages");
const sendMail_1 = require("../../utils/sendMail");
const confirm_mail_1 = require("../../utils/mail_templates/confirm_mail");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const createAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, organization } = req.body;
    const adminExist = yield admin_model_1.AdminModel.findOne({ email });
    if (adminExist) {
        return next(new errHandling_1.ResponseError(`${error_messages_1.ERROR_MESSAGES.conflict('admin account')}`, 409));
    }
    const org = yield organization_model_1.OrganizationModel.findById(organization);
    if (!org) {
        return next(new errHandling_1.ResponseError('organization not exist'));
    }
    const newAdmin = new admin_model_1.AdminModel(Object.assign(Object.assign({}, req.body), { organization }));
    const token = (0, jsonwebtoken_1.sign)({
        _id: org._id.toString(),
        email: newAdmin.email,
    }, `${process.env.JWT_SIGNATURE}`, { expiresIn: 60 * 60 * 24 });
    const confirmationLink = `${req.protocol}://${req.headers.host}/organization/${token}/confirm-organization`;
    const mailInfo = yield (0, sendMail_1.sendMail)({
        to: newAdmin.email,
        subject: 'Confirm Taskspace Organization',
        html: (0, confirm_mail_1.confirmMailTemp)({ to: newAdmin.email, confirmationLink }),
    });
    if (!mailInfo.accepted.length) {
        return new errHandling_1.ResponseError(`${error_messages_1.ERROR_MESSAGES.unavailableService}`);
    }
    if (!(yield newAdmin.save())) {
        return next(new errHandling_1.ResponseError(`${error_messages_1.ERROR_MESSAGES.serverErr}`));
    }
    return res
        .status(201)
        .json({ message: 'Please checkout your mail to confirm your account' });
});
exports.createAdmin = createAdmin;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const admin = yield admin_model_1.AdminModel.findOne({ email });
    if (!admin) {
        return next(new errHandling_1.ResponseError('In-valid credentials', 400));
    }
    if (!(0, bcryptjs_1.compareSync)(password, admin.password)) {
        return next(new errHandling_1.ResponseError('In-valid credentials', 400));
    }
    const org = yield organization_model_1.OrganizationModel.findById(admin.organization);
    if (!org || org.isDeleted) {
        return next(new errHandling_1.ResponseError(`${error_messages_1.ERROR_MESSAGES.notFound('Organization')}`));
    }
    if (!org.isVerified) {
        const token = (0, jsonwebtoken_1.sign)({
            _id: admin._id.toString(),
            email: admin.email,
        }, `${process.env.JWT_SIGNATURE}`, { expiresIn: 60 * 60 * 24 });
        const confirmationLink = `${req.protocol}://${req.headers.host}/organization/${token}/confirm-organization`;
        const mailInfo = yield (0, sendMail_1.sendMail)({
            to: admin.email,
            subject: 'Confirm Taskspace Organization',
            html: (0, confirm_mail_1.confirmMailTemp)({ to: admin.email, confirmationLink }),
        });
        if (!mailInfo.accepted.length) {
            return next(new errHandling_1.ResponseError(`${error_messages_1.ERROR_MESSAGES.unavailableService}`));
        }
        return next(new errHandling_1.ResponseError('Organization not verified yet, please check your mail to verify it'));
    }
    const token = (0, jsonwebtoken_1.sign)({
        _id: admin._id.toString(),
        email: admin.email,
        role: 'admin',
    }, `${process.env.JWT_SIGNATURE}`, { expiresIn: 60 * 60 * 24 });
    return res.status(200).json({ message: 'Done', token });
});
exports.login = login;
