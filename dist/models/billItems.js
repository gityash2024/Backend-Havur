"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billItemsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.billItemsSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    itemName: { type: String, default: "" },
    billId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Bills" },
    qty: { type: Number, default: "" },
    price: { type: Number, default: "" },
    amount: { type: Number, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "billItems" });
