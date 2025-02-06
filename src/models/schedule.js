"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleSchema = void 0;
const mongoose_1 = require("mongoose");
const shiftSchema = new mongoose_1.Schema({
    shiftTag: { type: String, required: true },
    availableFrom: { type: String, default: "" },
    availableTo: { type: String, default: "" },
}, { _id: false });
exports.scheduleSchema = new mongoose_1.Schema({
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
    patientPerTime: { type: String, default: "" },
    scheduleDate: { type: Date, required: true },
    shifts: { type: [shiftSchema], required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
}, { collection: "schedule" });
