"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.appointmentSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
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
    appointmentType: { type: String, default: "" },
    appointmentBy: {
        type: String,
        default: "",
        required: [true, "Appointment By required."],
    },
    slotTime: { type: Date, default: null },
    tokenNo: { type: Number, default: 0 },
    appointmentCharge: { type: String, default: "" },
    paymentMode: { type: String, default: "" },
    status: { type: Boolean, default: true },
    files: { type: [String], default: [] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "appointment" });
