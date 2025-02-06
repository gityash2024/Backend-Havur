import { Schema } from "mongoose";

export const folderSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, default: "" },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patients",
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "folders" }
);
