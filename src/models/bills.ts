import { Schema } from "mongoose";

export const billsSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    billId: { type: String },
    patientId: { type: Schema.Types.ObjectId, ref: "Patients" },
    billDate: { type: Date, required: [true, "Date required."] },
    amount: { type: Number, default: "" },
    status: { type: String, default: null },
    patientAdmissionId: { type: Schema.Types.ObjectId, ref: "Admission" },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospitals" },
    userId: { type: Schema.Types.ObjectId, ref: "Users", default: null },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "bills" }
);
