"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateAdd = exports.CaseHandler = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const caseHandler_1 = require("../../../models/caseHandler");
exports.CaseHandler = (0, mongoose_1.model)("CaseHandler", caseHandler_1.caseHandlerSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required().label("First Name"),
        lastName: joi_1.default.string().required().label("Last Name"),
        email: joi_1.default.string().email().required().label("Email"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateDelete = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateDelete = validateDelete;
