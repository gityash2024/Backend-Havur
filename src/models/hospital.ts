import { Schema } from "mongoose";
import { encrypt } from "../helper/encription";
import config from "config";
import jwt from "jsonwebtoken";

export const hospitalSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: [true, "Name required."] },
    emailAddress: { type: String, required: [true, "Email address required."] },
    password: { type: String, required: [true, "Password required."] },
    mobileNumber: { type: String, required: [true, "Mobile Number required."] },
    description: { type: String, default: "" },
    address: { type: String, required: [true, "Address required."] },
    location: { type: String, required: [true, "Location required."] },
    reviews: { type: String, default: "" },
    image: { type: String, default: "" },
    logo: { type: String, default: "" },
    type: { type: String, default: "hospital" },
    verificationCode: { type: String, default: "" },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "success", "block"],
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  },
  { collection: "hospital" }
);

hospitalSchema.methods.getAccessToken = function () {
  const token = jwt.sign({ hid: this._id }, config.get("jwtPrivateKey"));
  return encrypt(token);
};
