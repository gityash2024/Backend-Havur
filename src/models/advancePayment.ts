import { Schema } from "mongoose";

export const advancePaymentSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    paymentDate: { type: Date, default: null },
    patientId: { type: Schema.Types.ObjectId, ref: "Patients" },
    receiptNo: { type: String, required: [true, "Receipt No required."] },
    amount: { type: String, default: "" },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospitals",
      required: [true, "Hospitals required."],
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "advance_payment" }
);
