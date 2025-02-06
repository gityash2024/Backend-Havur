import { Schema } from "mongoose";

export const bedSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    bedId: { type: String },
    name: { type: String, required: [true, "Bed is required"] },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospitals",
    },
    bedType: {
      type: Schema.Types.ObjectId,
      ref: "BedType",
      required: [true, "Bed type required."],
    },
    description: { type: String, default: "" },
    charge: { type: String, required: [true, "Bed charge required."] },
    available: { type: String, default: "yes" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "bed" }
);
