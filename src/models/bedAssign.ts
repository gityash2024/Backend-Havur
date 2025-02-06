import { Schema } from "mongoose";

export const bedAssignSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    case: {
      type: Schema.Types.ObjectId,
      ref: "PatientCase",
      required: [true, "case required."],
    },
    ipdPatient: {
      type: Schema.Types.ObjectId,
      ref: "IpdPatient",
      required: [true, "IPD required."],
    },
    bed: {
      type: Schema.Types.ObjectId,
      ref: "Bed",
      required: [true, "bed required."],
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospitals",
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctors",
    },
    date: { type: Date, default: null },
    dischargeDate: { type: Date, default: null },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "bed_assign" }
);
