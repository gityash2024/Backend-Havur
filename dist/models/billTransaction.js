"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billTransactionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.billTransactionSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    transactionId: { type: String, default: "" },
    paymentType: { type: String, default: "" },
    amount: { type: Number, default: "" },
    billId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Bills" },
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Patients" },
    status: { type: String, default: null },
    isManualPayment: { type: String, default: "" },
    hospitalId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hospitals" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "bill_transaction" });
