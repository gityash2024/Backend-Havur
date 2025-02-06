"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceItemSchema = void 0;
const mongoose_1 = require("mongoose");
exports.invoiceItemSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    invoiceId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Invoices" },
    account: { type: String, default: "" },
    description: { type: String, default: "" },
    quantity: { type: Number, default: "" },
    price: { type: Number, default: "" },
    total: { type: Number, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "invoice_items" });
