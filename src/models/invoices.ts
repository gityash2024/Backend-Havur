import { Schema } from "mongoose";

export const invoiceSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    invoiceId: { type: String, default: "" },
    patientId: { type: Schema.Types.ObjectId, ref: "Patients" },
    invoiceDate: { type: Date, default: null },
    amount: { type: Number, default: "" },
    discount: { type: String, default: "" },
    status: { type: String, default: "" },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospitals",
      required: [true, "Hospitals required."],
    },
    userId: { type: Schema.Types.ObjectId, ref: "Users", default: null },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "invoices" }
);
