"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateAdd = exports.PatientCase = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const patientCase_1 = require("../../../models/patientCase");
exports.PatientCase = (0, mongoose_1.model)("PatientCase", patientCase_1.patientCaseSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        patientId: joi_1.default.string().hex().length(24).required().label("Patient ID"),
        doctorId: joi_1.default.string().hex().length(24).required().label("Doctor ID"),
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
