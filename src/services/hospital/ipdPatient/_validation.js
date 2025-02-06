"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateAdd = exports.IpdPatient = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const ipdPatient_1 = require("../../../models/ipdPatient");
exports.IpdPatient = (0, mongoose_1.model)("IpdPatient", ipdPatient_1.ipdPatientSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        patientId: joi_1.default.string().hex().length(24).required().label("Patient ID"),
        doctorId: joi_1.default.string().hex().length(24).required().label("Doctor ID"),
        caseId: joi_1.default.string().hex().length(24).required().label("Case ID"),
        bed: joi_1.default.string().hex().length(24).required().label("Bed"),
        bedType: joi_1.default.string().hex().length(24).required().label("Bed Type"),
        admissionDate: joi_1.default.string().required().label("Admission Date"),
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
