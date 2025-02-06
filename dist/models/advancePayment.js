"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advancePaymentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.advancePaymentSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    paymentDate: { type: Date, default: null },
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Patients" },
    receiptNo: { type: String, required: [true, "Receipt No required."] },
    amount: { type: String, default: "" },
    hospitalId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hospitals",
        required: [true, "Hospitals required."],
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "advance_payment" });
