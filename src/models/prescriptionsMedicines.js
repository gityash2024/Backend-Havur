"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescriptionsMedicinesSchema = void 0;
const mongoose_1 = require("mongoose");
exports.prescriptionsMedicinesSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    prescriptionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Prescriptions" },
    medicine: { type: String, default: "" },
    dosage: { type: String, default: "" },
    day: { type: String, default: "" },
    time: { type: String, default: "" },
    doseInterval: { type: String, default: "" },
    comment: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "prescriptionsMedicines" });
