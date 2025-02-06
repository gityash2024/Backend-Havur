import { Schema } from "mongoose";

export const caseHandlerSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    firstName: { type: String, required: [true, "First name required."] },
    lastName: { type: String, required: [true, "Last name required."] },
    email: { type: String, required: [true, "Email required"] },
    designation: { type: String, default: "" },
    phone: { type: String, default: "" },
    gender: { type: String, default: "" },
    qualification: { type: String, default: "" },
    birthDate: { type: Date, default: "" },
    bloodGroup: { type: String, default: "" },
    password: { type: String, default: "" },
    profile: { type: String, default: "" },
    address1: { type: String, default: "" },
    address2: { type: String, default: "" },
    city: { type: String, default: "" },
    zip: { type: String, default: "" },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospitals",
      required: [true, "Hospitals required."],
    },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "case_handler" }
);
