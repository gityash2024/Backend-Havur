"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorSchema = void 0;
const mongoose_1 = require("mongoose");
const encription_1 = require("../helper/encription");
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hospitalSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hospitals" },
    hospitalStatus: {
        type: String,
        default: "pending",
        enum: ["pending", "success", "block"],
    },
}, { _id: false });
const clinicSchema = new mongoose_1.Schema({
    cName: { type: String, default: "" },
    address: { type: String, default: "" },
    area: { type: String, default: "" },
    city: { type: String, default: "" },
    pin: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    cPhone: { type: String, default: "" },
}, { _id: false });
const shareInSchema = new mongoose_1.Schema({
    opd: { type: String, default: "" },
    indoorVisite: { type: String, default: "" },
    operation: { type: String, default: "" },
    procedure: { type: String, default: "" },
}, { _id: false });
exports.doctorSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
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
    selectedHospital: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hospitals" },
    mFile: { type: [String], default: [] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "doctor" });
exports.doctorSchema.methods.getAccessToken = function () {
    const token = jsonwebtoken_1.default.sign({ did: this._id }, config_1.default.get("jwtPrivateKey"));
    return (0, encription_1.encrypt)(token);
};
