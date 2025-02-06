import { Schema } from "mongoose";

export const bedTypeSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospitals",
    },
    bedType: { type: String, required: [true, "Bed type required."] },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "bed_type" }
);
