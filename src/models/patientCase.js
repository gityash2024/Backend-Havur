"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientCaseSchema = void 0;
const mongoose_1 = require("mongoose");
exports.patientCaseSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    caseId: { type: String, required: [true, "Case Id required."] },
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patients",
        required: [true, "Patients required."],
    },
    hospitalId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hospitals",
        required: [true, "Hospitals required."],
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Doctors",
        required: [true, "Doctor required."],
    },
    caseDate: { type: Date, default: "" },
    phone: { type: String, default: "" },
    fee: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "patient_case" });
