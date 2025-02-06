"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPassword = exports.validateLogin = exports.validateVerify = exports.validateEmail = exports.validateMobile = exports.Doctor = void 0;
const mongoose_1 = require("mongoose");
const doctor_1 = require("../../../models/doctor");
const joi_1 = __importDefault(require("joi"));
exports.Doctor = (0, mongoose_1.model)("Doctors", doctor_1.doctorSchema);
const validateMobile = (data) => {
    const schema = joi_1.default.object({
        mobileNumber: joi_1.default.string().required().label("Mobile Number"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateMobile = validateMobile;
const validateEmail = (data) => {
    const schema = joi_1.default.object({
        emailId: joi_1.default.string().email().required().label("Email ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateEmail = validateEmail;
const validateVerify = (data) => {
    const schema = joi_1.default.object({
        mobileNumber: joi_1.default.string().required().label("Mobile Number"),
        verificationCode: joi_1.default.string().required().label("Verification Code"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateVerify = validateVerify;
const validateLogin = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().required().label("Mobile or Email"),
        password: joi_1.default.string().required().label("Password"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateLogin = validateLogin;
const validateResetPassword = (data) => {
    const schema = joi_1.default.object({
        verificationCode: joi_1.default.string().required().label("Verification Code"),
        password: joi_1.default.string().required().label("Password"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateResetPassword = validateResetPassword;
