"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admissionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.admissionSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    admissionId: { type: String, default: "" },
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
    admissionDate: { type: Date, required: [true, "Date & time required ."] },
    dischargeDate: { type: Date, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "admission" });
