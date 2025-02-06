"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdate = exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const admin_1 = require("../../../models/admin");
exports.Admin = (0, mongoose_1.model)('Admin', admin_1.adminSchema);
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        userName: joi_1.default.string().required().label('User Name'),
        emailAddress: joi_1.default.string().required().email().label('Email Address')
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
