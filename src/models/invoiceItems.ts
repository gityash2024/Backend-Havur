import { Schema } from "mongoose";

export const invoiceItemSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoices" },
    account: { type: String, default: "" },
    description: { type: String, default: "" },
    quantity: { type: Number, default: "" },
    price: { type: Number, default: "" },
    total: { type: Number, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "invoice_items" }
);
