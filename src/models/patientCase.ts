import { Schema } from "mongoose";

export const patientCaseSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    caseId: { type: String, required: [true, "Case Id required."] },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patients",
      required: [true, "Patients required."],
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospitals",
      required: [true, "Hospitals required."],
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctors",
      required: [true, "Doctor required."],
    },
    caseDate: { type: Date, default: "" },
    phone: { type: String, default: "" },
    fee: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "patient_case" }
);
