"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersSchema = void 0;
const mongoose_1 = require("mongoose");
const encription_1 = require("../helper/encription");
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.usersSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    hospitalId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { collection: "users" });
exports.usersSchema.methods.getAccessToken = function () {
    const token = jsonwebtoken_1.default.sign({ uid: this._id, hid: this.hospitalId }, config_1.default.get("jwtPrivateKey"));
    return (0, encription_1.encrypt)(token);
};
