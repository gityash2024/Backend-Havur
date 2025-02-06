"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescriptionsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.prescriptionsSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patients",
        required: [true, "Patients required."],
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Doctors",
        required: [true, "Doctor required."],
    },
    foodAllergies: { type: String, default: "" },
    tendencyBleed: { type: String, default: "" },
    heartDisease: { type: String, default: "" },
    highBloodPressure: { type: String, default: "" },
    diabetic: { type: String, default: "" },
    surgery: { type: String, default: "" },
    accident: { type: String, default: "" },
    others: { type: String, default: "" },
    medicalHistory: { type: String, default: "" },
    currentMedication: { type: String, default: "" },
    femalePregnancy: { type: String, default: "" },
    breastFeeding: { type: String, default: "" },
    healthInsurance: { type: String, default: "" },
    lowIncome: { type: String, default: "" },
    reference: { type: String, default: "" },
    plusRate: { type: String, default: "" },
    temperature: { type: String, default: "" },
    problemDescription: { type: String, default: "" },
    test: { type: String, default: "" },
    advice: { type: String, default: "" },
    nextVisitQty: { type: String, default: "" },
    nextVisitTime: { type: String, default: "" },
    hospitalId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hospitals",
        required: [true, "Hospitals required."],
    },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "prescriptions" });
