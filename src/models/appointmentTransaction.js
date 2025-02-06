"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentTransactionsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.appointmentTransactionsSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    appointmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Appointment" },
    transactionType: { type: String, required: [true, "Type required."] },
    transactionId: { type: String, default: "" },
    status: { type: Boolean, default: null },
    hospitalId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hospitals" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "appointment_transactions" });
