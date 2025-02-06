"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateView = exports.validateAdd = exports.Doctor = exports.AppointmentTransaction = exports.Appointment = void 0;
const joi_1 = __importDefault(require("joi"));
const appointment_1 = require("../../../models/appointment");
const mongoose_1 = require("mongoose");
const appointmentTransaction_1 = require("../../../models/appointmentTransaction");
const doctor_1 = require("../../../models/doctor");
exports.Appointment = (0, mongoose_1.model)("Appointment", appointment_1.appointmentSchema);
exports.AppointmentTransaction = (0, mongoose_1.model)("AppointmentTransaction", appointmentTransaction_1.appointmentTransactionsSchema);
exports.Doctor = (0, mongoose_1.model)("Doctor", doctor_1.doctorSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        doctorId: joi_1.default.string().hex().length(24).label("Doctor ID"),
        hospitalId: joi_1.default.string().hex().length(24).label("Hospital ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateView = (data) => {
    const schema = joi_1.default.object({
        aid: joi_1.default.string().hex().length(24).label("ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateView = validateView;
