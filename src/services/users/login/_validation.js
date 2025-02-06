"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPassword = exports.validateEmail = exports.validateNobile = exports.validateVerify = exports.validateLoginWithMobile = exports.validateLogin = exports.validateSignup = exports.Patient = void 0;
const mongoose_1 = require("mongoose");
const patient_1 = require("../../../models/patient");
const joi_1 = __importDefault(require("joi"));
exports.Patient = (0, mongoose_1.model)("Patients", patient_1.patientSchema);
const validateSignup = (data) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required().label("First Name"),
        lastName: joi_1.default.string().required().label("Last Name"),
        emailAddress: joi_1.default.string().required().email().label("Email Address"),
        password: joi_1.default.string().required().label("Password"),
        mobileNumber: joi_1.default.string().required().label("Mobile Number"),
        gender: joi_1.default.string().required().label("Gender"),
        birthDate: joi_1.default.string().required().label("Date of Birth"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateSignup = validateSignup;
const validateLogin = (data) => {
    const schema = joi_1.default.object({
        emailAddress: joi_1.default.string().required().email().label("Email Address"),
        password: joi_1.default.string().required().label("Password"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateLogin = validateLogin;
const validateLoginWithMobile = (data) => {
    const schema = joi_1.default.object({
        mobileNumber: joi_1.default.string().required().label("Mobile Number"),
        verificationCode: joi_1.default.string().required().label("Verification Code"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateLoginWithMobile = validateLoginWithMobile;
const validateVerify = (data) => {
    const schema = joi_1.default.object({
        emailAddress: joi_1.default.string().required().email().label("Email Address"),
        verificationCode: joi_1.default.string().required().label("Verification Code"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateVerify = validateVerify;
const validateNobile = (data) => {
    const schema = joi_1.default.object({
        mobileNumber: joi_1.default.string().required().label("Mobile Number"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateNobile = validateNobile;
const validateEmail = (data) => {
    const schema = joi_1.default.object({
        emailAddress: joi_1.default.string().email().required().label("Email Address"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateEmail = validateEmail;
const validateResetPassword = (data) => {
    const schema = joi_1.default.object({
        verificationCode: joi_1.default.string().required().label("Verification Code"),
        password: joi_1.default.string().required().label("Password"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateResetPassword = validateResetPassword;
