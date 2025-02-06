import { Schema } from "mongoose";

export const billItemsSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    itemName: { type: String, default: "" },
    billId: { type: Schema.Types.ObjectId, ref: "Bills" },
    qty: { type: Number, default: "" },
    price: { type: Number, default: "" },
    amount: { type: Number, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "billItems" }
);
