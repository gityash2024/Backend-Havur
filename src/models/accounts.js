"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.accountsSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    type: { type: String, required: [true, "Type required."] },
    description: { type: String, default: "" },
    status: { type: Boolean, default: null },
    hospitalId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hospitals" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "accounts" });
