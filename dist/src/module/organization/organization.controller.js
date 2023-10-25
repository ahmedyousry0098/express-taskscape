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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmOrganization = exports.getOrganizationById = exports.createOrganization = void 0;
const organization_model_1 = require("../../../DB/model/organization.model");
const errHandling_1 = require("../../utils/errHandling");
const error_messages_1 = require("../../constants/error_messages");
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_model_1 = require("../../../DB/model/admin.model");
const createOrganization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { company } = req.body;
    const existsOrg = yield organization_model_1.OrganizationModel.findOne({ company });
    if (existsOrg) {
        return next(new errHandling_1.ResponseError(error_messages_1.ERROR_MESSAGES.conflict('company'), 409));
    }
    const createdOrg = new organization_model_1.OrganizationModel(req.body);
    if (req.file) {
        const { public_id, secure_url } = yield cloudinary_1.default.uploader.upload(req.file.path, {
            folder: `${process.env.APP_TITLE}/org/${createdOrg.company}`
        });
        if (!public_id || !secure_url)
            return next(new errHandling_1.ResponseError(error_messages_1.ERROR_MESSAGES.unavailableService, 503));
        createdOrg.logo = { public_id, secure_url };
    }
    if (!(yield createdOrg.save())) {
        return next(new errHandling_1.ResponseError(error_messages_1.ERROR_MESSAGES.serverErr, 500));
    }
    return res.status(201).json({ message: 'done', organization: createdOrg });
});
exports.createOrganization = createOrganization;
const getOrganizationById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orgId } = req.params;
    const org = yield organization_model_1.OrganizationModel.findById(orgId);
    if (!org || org.isDeleted) {
        return next(new errHandling_1.ResponseError(error_messages_1.ERROR_MESSAGES.notFound('organization'), 404));
    }
    if (!org.isVerified) {
        return next(new errHandling_1.ResponseError('Please Check your mail and verify Organization first'));
    }
    const orgAdmin = yield admin_model_1.AdminModel.findOne({ organization: org._id });
    return res.status(200).json({ message: 'done', organization: org, admin: orgAdmin });
});
exports.getOrganizationById = getOrganizationById;
const confirmOrganization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SIGNATURE}`);
    if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
        return next(new errHandling_1.ResponseError('In-valid Authorization Key'));
    }
    const org = yield organization_model_1.OrganizationModel.findByIdAndUpdate(decoded.id, { isVerified: true }, { new: true });
    if (!org || org.isDeleted) {
        return next(new errHandling_1.ResponseError(`${error_messages_1.ERROR_MESSAGES.notFound('Organization')}`));
    }
    if (org.isVerified) {
        return next(new errHandling_1.ResponseError('Organization Already Verified', 403));
    }
    return res.status(200).json({ message: 'Organization Verified Successfully' });
});
exports.confirmOrganization = confirmOrganization;
