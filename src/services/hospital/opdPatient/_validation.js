"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateAdd = exports.OpdPatient = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const opdPatient_1 = require("../../../models/opdPatient");
exports.OpdPatient = (0, mongoose_1.model)("OpdPatient", opdPatient_1.opdPatientSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        patientId: joi_1.default.string().hex().length(24).required().label("Patient ID"),
        doctorId: joi_1.default.string().hex().length(24).required().label("Doctor ID"),
        caseId: joi_1.default.string().hex().length(24).required().label("Case ID"),
        appointmentDate: joi_1.default.string().required().label("Appointment Date"),
        doctorOpdCharge: joi_1.default.number().required().label("Doctor OPD Charge"),
        paymentMode: joi_1.default.string().required().label("Payment Mode"),
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
