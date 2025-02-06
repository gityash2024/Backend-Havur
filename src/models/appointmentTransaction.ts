import { Schema } from "mongoose";

export const appointmentTransactionsSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    transactionType: { type: String, required: [true, "Type required."] },
    transactionId: { type: String, default: "" },
    status: { type: Boolean, default: null },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospitals" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "appointment_transactions" }
);
