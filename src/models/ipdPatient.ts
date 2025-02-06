import { Schema } from "mongoose";

export const ipdPatientSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patients",
      required: [true, "Patients required."],
    },
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "PatientCase",
      required: [true, "Case required."],
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctors",
      required: [true, "Doctor required."],
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospitals",
    },
    ipdNo: { type: String },
    weight: { type: String, default: "" },
    height: { type: String, default: "" },
    bloodPressure: { type: String, default: "" },
    admissionDate: {
      type: Date,
      required: [true, "Admission Date required."],
    },
    bed: {
      type: Schema.Types.ObjectId,
      ref: "Bed",
      required: [true, "Bed required."],
    },
    bedType: {
      type: Schema.Types.ObjectId,
      ref: "BedType",
      required: [true, "Bed type required."],
    },
    symptoms: { type: String, default: "" },
    notes: { type: String, default: "" },
    billStatus: { type: String, default: "unpaid" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "ipd_patients" }
);
