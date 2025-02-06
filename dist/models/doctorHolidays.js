"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holidaySchema = void 0;
const mongoose_1 = require("mongoose");
exports.holidaySchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Doctors",
        required: [true, "Doctor required."],
    },
    holidaydate: { type: Date, default: "" },
    notes: { type: String, default: "" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "holidays" });
