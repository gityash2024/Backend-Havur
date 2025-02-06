"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateUpdate = exports.validateAdd = exports.Users = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const users_1 = require("../../../models/users");
exports.Users = (0, mongoose_1.model)("Users", users_1.usersSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required().label("First Name"),
        lastName: joi_1.default.string().required().label("Last Name"),
        password: joi_1.default.string().required().label("Password"),
        email: joi_1.default.string().required().label("Email"),
        gender: joi_1.default.string().required().label("Gender"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required().label("First Name"),
        lastName: joi_1.default.string().required().label("Last Name"),
        email: joi_1.default.string().required().label("Email"),
        gender: joi_1.default.string().required().label("Gender"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
const validateDelete = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateDelete = validateDelete;
