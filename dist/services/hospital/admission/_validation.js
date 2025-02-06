"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdd = exports.Patient = exports.Doctor = exports.Admission = void 0;
const joi_1 = __importDefault(require("joi"));
const admission_1 = require("../../../models/admission");
const doctor_1 = require("../../../models/doctor");
const patient_1 = require("../../../models/patient");
const mongoose_1 = require("mongoose");
exports.Admission = (0, mongoose_1.model)('Admission', admission_1.admissionSchema);
exports.Doctor = (0, mongoose_1.model)('Doctor', doctor_1.doctorSchema);
exports.Patient = (0, mongoose_1.model)('Patient', patient_1.patientSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        doctorId: joi_1.default.string().hex().required().length(24).label('Doctor ID'),
        patientId: joi_1.default.string().hex().required().length(24).label('Patient ID'),
        hid: joi_1.default.string().hex().required().length(24).label('Hospital ID'),
        admissionDate: joi_1.default.string().required().label('Admission Date'),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
