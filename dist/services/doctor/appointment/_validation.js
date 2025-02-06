"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpload = exports.validateUpdate = exports.validateView = exports.Patients = exports.Appointment = void 0;
const mongoose_1 = require("mongoose");
const appointment_1 = require("../../../models/appointment");
const patient_1 = require("../../../models/patient");
const joi_1 = __importDefault(require("joi"));
exports.Appointment = (0, mongoose_1.model)('Appointment', appointment_1.appointmentSchema);
exports.Patients = (0, mongoose_1.model)('Patient', patient_1.patientSchema);
const validateView = (data) => {
    const schema = joi_1.default.object({
        aid: joi_1.default.string().required().label('Appointment ID'),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateView = validateView;
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        pid: joi_1.default.string().required().label('Patient ID'),
        uploadFile: joi_1.default.string().required().label('Upload File URL needed')
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
const validateUpload = (data) => {
    const schema = joi_1.default.object({
        pid: joi_1.default.string().required().label('Patient ID'),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpload = validateUpload;
