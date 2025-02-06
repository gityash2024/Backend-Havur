import { Schema } from "mongoose";

export const qualificationSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, default: "" },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "qualification" }
);
