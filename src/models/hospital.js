"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hospitalSchema = void 0;
const mongoose_1 = require("mongoose");
const encription_1 = require("../helper/encription");
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.hospitalSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
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
}, { collection: "hospital" });
exports.hospitalSchema.methods.getAccessToken = function () {
    const token = jsonwebtoken_1.default.sign({ hid: this._id }, config_1.default.get("jwtPrivateKey"));
    return (0, encription_1.encrypt)(token);
};
