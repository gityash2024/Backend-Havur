"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipdPatientSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ipdPatientSchema = new mongoose_1.Schema({
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
    ipdNo: { type: String },
    weight: { type: String, default: "" },
    height: { type: String, default: "" },
    bloodPressure: { type: String, default: "" },
    admissionDate: {
        type: Date,
        required: [true, "Admission Date required."],
    },
    bed: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Bed",
        required: [true, "Bed required."],
    },
    bedType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "BedType",
        required: [true, "Bed type required."],
    },
    symptoms: { type: String, default: "" },
    notes: { type: String, default: "" },
    billStatus: { type: String, default: "unpaid" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "ipd_patients" });
