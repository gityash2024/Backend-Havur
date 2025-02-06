"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenNoSchema = void 0;
const mongoose_1 = require("mongoose");
exports.tokenNoSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    hospitalId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hospitals",
        required: [true, "Hospitals required."],
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Doctors",
        required: [true, "Doctor required."],
    },
    tokenNo: { type: Number, default: 0 },
    date: { type: Date, default: null },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "token_no" });
