"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPassword = exports.validateEmail = exports.validateLogin = exports.Hospital = void 0;
const mongoose_1 = require("mongoose");
const hospital_1 = require("../../../models/hospital");
const joi_1 = __importDefault(require("joi"));
exports.Hospital = (0, mongoose_1.model)('Hospitals', hospital_1.hospitalSchema);
const validateLogin = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().label('User Name'),
        password: joi_1.default.string().required().label('Password'),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateLogin = validateLogin;
const validateEmail = (data) => {
    const schema = joi_1.default.object({
        emailAddress: joi_1.default.string().required().label('Email Address')
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateEmail = validateEmail;
const validateResetPassword = (data) => {
    const schema = joi_1.default.object({
        verificationCode: joi_1.default.string().required().label('Verification Code'),
        password: joi_1.default.string().required().label('Password')
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateResetPassword = validateResetPassword;
