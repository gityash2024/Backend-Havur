"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.billsSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    billId: { type: String },
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Patients" },
    billDate: { type: Date, required: [true, "Date required."] },
    amount: { type: Number, default: "" },
    status: { type: String, default: null },
    patientAdmissionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Admission" },
    hospitalId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hospitals" },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", default: null },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "bills" });
