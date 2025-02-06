"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualificationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.qualificationSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    name: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "qualification" });
