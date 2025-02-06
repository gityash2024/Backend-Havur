"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceSchema = void 0;
const mongoose_1 = require("mongoose");
exports.invoiceSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    invoiceId: { type: String, default: "" },
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Patients" },
    invoiceDate: { type: Date, default: null },
    amount: { type: Number, default: "" },
    discount: { type: String, default: "" },
    status: { type: String, default: "" },
    hospitalId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hospitals",
        required: [true, "Hospitals required."],
    },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", default: null },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "invoices" });
