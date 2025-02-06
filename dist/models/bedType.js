"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bedTypeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.bedTypeSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    hospitalId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hospitals",
    },
    bedType: { type: String, required: [true, "Bed type required."] },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "bed_type" });
