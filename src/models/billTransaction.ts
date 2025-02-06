import { Schema } from "mongoose";

export const billTransactionSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    transactionId: { type: String, default: "" },
    paymentType: { type: String, default: "" },
    amount: { type: Number, default: "" },
    billId: { type: Schema.Types.ObjectId, ref: "Bills" },
    patientId: { type: Schema.Types.ObjectId, ref: "Patients" },
    status: { type: String, default: null },
    isManualPayment: { type: String, default: "" },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospitals" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "bill_transaction" }
);
