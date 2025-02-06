import { Schema } from "mongoose";

export const paymentSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    paymentDate: { type: Date, default: null },
    accountId: { type: Schema.Types.ObjectId, ref: "Accounts" },
    payTo: { type: String, required: [true, "Pay to required."] },
    amount: { type: String, default: "" },
    description: { type: String, default: "" },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospitals",
      required: [true, "Hospitals required."],
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "payment" }
);
