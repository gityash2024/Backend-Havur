"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPassword = exports.validateLogin = exports.validateVerify = exports.validateEmail = exports.Users = void 0;
const mongoose_1 = require("mongoose");
const users_1 = require("../../../models/users");
const joi_1 = __importDefault(require("joi"));
exports.Users = (0, mongoose_1.model)("Users", users_1.usersSchema);
const validateEmail = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required().label("Email ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateEmail = validateEmail;
const validateVerify = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().required().label("Email"),
        otp: joi_1.default.string().required().label("Otp"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateVerify = validateVerify;
const validateLogin = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().required().label("Email"),
        password: joi_1.default.string().required().label("Password"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateLogin = validateLogin;
const validateResetPassword = (data) => {
    const schema = joi_1.default.object({
        otp: joi_1.default.string().required().label("Otp"),
        password: joi_1.default.string().required().label("Password"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateResetPassword = validateResetPassword;
