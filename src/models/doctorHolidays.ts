import { Schema } from "mongoose";

export const holidaySchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctors",
      required: [true, "Doctor required."],
    },
    holidaydate: { type: Date, default: "" },
    notes: { type: String, default: "" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "holidays" }
);
