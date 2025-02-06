"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientSchema = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("config"));
const encription_1 = require("../helper/encription");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const communicationSchema = new mongoose_1.Schema({
    residence: { type: String, default: "" },
    office: { type: String, default: "" },
    other: { type: String, default: "" },
}, { _id: false });
const addressSchema = new mongoose_1.Schema({
    address: { type: String, default: "" },
    area: { type: String, default: "" },
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    pin: { type: String, default: "" },
}, { _id: false });
exports.patientSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
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
}, { collection: "patients" });
exports.patientSchema.methods.getAccessToken = function () {
    const token = jsonwebtoken_1.default.sign({ pid: this._id }, config_1.default.get("jwtPrivateKey"));
    return (0, encription_1.encrypt)(token);
};
