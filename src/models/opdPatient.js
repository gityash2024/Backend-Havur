"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opdPatientSchema = void 0;
const mongoose_1 = require("mongoose");
exports.opdPatientSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patients",
        required: [true, "Patients required."],
    },
    caseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "PatientCase",
        required: [true, "Case required."],
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Doctors",
        required: [true, "Doctor required."],
    },
    hospitalId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hospitals",
    },
    opdNo: { type: String },
    weight: { type: String, default: "" },
    height: { type: String, default: "" },
    bloodPressure: { type: String, default: "" },
    appointmentDate: { type: Date, default: null },
    doctorOpdCharge: { type: Number, required: [true, "charge required."] },
    paymentMode: { type: String, required: [true, "Payment mode required."] },
    symptoms: { type: String, default: "" },
    notes: { type: String, default: "" },
    history: { type: String, default: "" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "opd_patients" });
