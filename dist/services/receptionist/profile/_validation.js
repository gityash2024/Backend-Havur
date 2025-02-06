"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdate = exports.Users = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const users_1 = require("../../../models/users");
exports.Users = (0, mongoose_1.model)("Users", users_1.usersSchema);
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required().label("First Name"),
        lastName: joi_1.default.string().required().label("Last Name"),
        dob: joi_1.default.string().required().label("Date of birth"),
        phone: joi_1.default.string().required().label("Phone"),
        profile: joi_1.default.string().required().label("Profile"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
