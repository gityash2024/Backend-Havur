import { Schema } from "mongoose";
import { encrypt } from "../helper/encription";
import config from "config";
import jwt from "jsonwebtoken";

const hospitalSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: "Hospitals" },
    hospitalStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "success", "block"],
    },
  },
  { _id: false }
);

const clinicSchema = new Schema(
  {
    cName: { type: String, default: "" },
    address: { type: String, default: "" },
    area: { type: String, default: "" },
    city: { type: String, default: "" },
    pin: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    cPhone: { type: String, default: "" },
  },
  { _id: false }
);

const shareInSchema = new Schema(
  {
    opd: { type: String, default: "" },
    indoorVisite: { type: String, default: "" },
    operation: { type: String, default: "" },
    procedure: { type: String, default: "" },
  },
  { _id: false }
);

export const doctorSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    reference: { type: String, default: "" },
    type: { type: String, default: "" },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive", "block"],
    },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    middleName: { type: String, default: "" },
    qualification: { type: String, default: "" },
    specialization: { type: String, default: "" },
    department: { type: String, default: "" },
    registrationNo: { type: String, default: "" },
    image: { type: String, default: "" },
    age: { type: String, default: "" },
    dob: { type: Date, default: "" },
    wedding: { type: Date, default: "" },
    pancard: { type: String, default: "" },
    aadharNo: { type: String, default: "" },
    mobileNumber: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    clinicDetails: { type: clinicSchema, default: {} },
    shareIn: { type: shareInSchema, default: {} },
    appointmentCharge: { type: String, default: "" },
    hospitalId: { type: [hospitalSchema], default: "" },
    verificationCode: { type: String, default: null },
    password: { type: String, default: "" },
    requestType: {
      type: String,
      default: "admin",
      enum: ["admin", "superadmin", "user"],
    },
    requestStatus: { type: String, default: "confirm" },
    otp: { type: String, default: "" },
    selectedHospital: { type: Schema.Types.ObjectId, ref: "Hospitals" },
    mFile: { type: [String], default: [] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "doctor" }
);

doctorSchema.methods.getAccessToken = function () {
  const token = jwt.sign({ did: this._id }, config.get("jwtPrivateKey"));
  return encrypt(token);
};
