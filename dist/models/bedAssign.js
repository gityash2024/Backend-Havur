"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bedAssignSchema = void 0;
const mongoose_1 = require("mongoose");
exports.bedAssignSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    case: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "PatientCase",
        required: [true, "case required."],
    },
    ipdPatient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "IpdPatient",
        required: [true, "IPD required."],
    },
    bed: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Bed",
        required: [true, "bed required."],
    },
    hospitalId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hospitals",
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Doctors",
    },
    date: { type: Date, default: null },
    dischargeDate: { type: Date, default: null },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "bed_assign" });
