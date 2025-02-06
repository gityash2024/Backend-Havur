"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bedSchema = void 0;
const mongoose_1 = require("mongoose");
exports.bedSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    bedId: { type: String },
    name: { type: String, required: [true, "Bed is required"] },
    hospitalId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hospitals",
    },
    bedType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "BedType",
        required: [true, "Bed type required."],
    },
    description: { type: String, default: "" },
    charge: { type: String, required: [true, "Bed charge required."] },
    available: { type: String, default: "yes" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "bed" });
