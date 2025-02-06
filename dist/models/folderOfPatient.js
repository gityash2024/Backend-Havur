"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderSchema = void 0;
const mongoose_1 = require("mongoose");
exports.folderSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    name: { type: String, default: "" },
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patients",
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "folders" });
