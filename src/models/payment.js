"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.paymentSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    paymentDate: { type: Date, default: null },
    accountId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Accounts" },
    payTo: { type: String, required: [true, "Pay to required."] },
    amount: { type: String, default: "" },
    description: { type: String, default: "" },
    hospitalId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hospitals",
        required: [true, "Hospitals required."],
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "payment" });
