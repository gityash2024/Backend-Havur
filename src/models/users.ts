import { Schema } from "mongoose";
import { encrypt } from "../helper/encription";
import config from "config";
import jwt from "jsonwebtoken";

export const usersSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospitals",
    },
    firstName: { type: String, required: [true, "FirstName required."] },
    lastName: { type: String, required: [true, "LastName required."] },
    email: { type: String, required: [true, "Email required."] },
    phone: { type: String, default: "" },
    password: { type: String, required: [true, "Password required"] },
    dob: { type: Date, default: "" },
    gender: { type: String, required: [true, "Gender required."] },
    profile: { type: String, default: "" },
    otp: { type: Number, default: "" },
    role: { type: String, required: [true, "Role required."] },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "users" }
);

usersSchema.methods.getAccessToken = function () {
  const token = jwt.sign(
    { uid: this._id, hid: this.hospitalId },
    config.get("jwtPrivateKey")
  );
  return encrypt(token);
};
