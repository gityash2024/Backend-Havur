import { Schema } from "mongoose";

export const accountsSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    type: { type: String, required: [true, "Type required."] },
    description: { type: String, default: "" },
    status: { type: Boolean, default: null },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospitals" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "accounts" }
);
