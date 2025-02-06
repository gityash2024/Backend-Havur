import { Schema } from "mongoose";

export const admissionSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    admissionId: { type: String, default: "" },
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
    admissionDate: { type: Date, required: [true, "Date & time required ."] },
    dischargeDate: { type: Date, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "admission" }
);
