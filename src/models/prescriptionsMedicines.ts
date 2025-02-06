import { Schema } from "mongoose";

export const prescriptionsMedicinesSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescriptions" },
    medicine: { type: String, default: "" },
    dosage: { type: String, default: "" },
    day: { type: String, default: "" },
    time: { type: String, default: "" },
    doseInterval: { type: String, default: "" },
    comment: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "prescriptionsMedicines" }
);
