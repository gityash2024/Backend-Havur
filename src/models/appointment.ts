import { Schema } from "mongoose";

export const appointmentSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
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
    appointmentType: { type: String, default: "" },
    appointmentBy: {
      type: String,
      default: "",
      required: [true, "Appointment By required."],
    },
    slotTime: { type: Date, default: null },
    tokenNo: { type: Number, default: 0 },
    appointmentCharge: { type: String, default: "" },
    paymentMode: { type: String, default: "" },
    status: { type: Boolean, default: true },
    files: { type: [String], default: [] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "appointment" }
);
