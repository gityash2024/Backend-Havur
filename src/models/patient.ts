import { Schema } from "mongoose";
import config from "config";
import { encrypt } from "../helper/encription";
import jwt from "jsonwebtoken";

const communicationSchema = new Schema(
  {
    residence: { type: String, default: "" },
    office: { type: String, default: "" },
    other: { type: String, default: "" },
  },
  { _id: false }
);

const addressSchema = new Schema(
  {
    address: { type: String, default: "" },
    area: { type: String, default: "" },
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    pin: { type: String, default: "" },
  },
  { _id: false }
);

export const patientSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    firstName: { type: String, default: "" },
    middleName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    birthDate: { type: Date, default: "" },
    age: { type: String, default: "" },
    gender: { type: String, default: "" },
    wedding: { type: Date, default: "" },
    language: { type: String, default: "" },
    religion: { type: String, default: "" },
    weight: { type: String, default: "" },
    height: { type: String, default: "" },
    maritialStatus: { type: String, default: "" },
    communication: { type: communicationSchema, default: {} },
    emailAddress: { type: String, required: [true, "Email address required."] },
    address: { type: addressSchema, default: {} },
    estimate: { type: String, default: "" },
    aadharNo: { type: String, default: "" },
    panNo: { type: String, default: "" },
    memberShipId: { type: String, default: "" },
    employeeId: { type: String, default: "" },
    occupation: { type: String, default: "" },
    spouseOccupation: { type: String, default: "" },
    companyName: { type: String, default: "" },
    education: { type: String, default: "" },
    mediclaim: { type: String, default: "" },
    remark: { type: String, default: "" },
    password: { type: String, required: [true, "Password required."] },
    mobileNumber: { type: String, default: "" },
    photo: { type: String, default: "" },
    verificationCode: { type: String, default: "" },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "success", "block"],
    },
    mFile: { type: [String], default: [] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "patients" }
);

patientSchema.methods.getAccessToken = function () {
  const token = jwt.sign({ pid: this._id }, config.get("jwtPrivateKey"));
  return encrypt(token);
};
