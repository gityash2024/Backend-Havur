"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.sendOtp = exports.verifyOtp = exports.signup = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const encription_1 = require("../../../helper/encription");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateMobile)(req.body);
    if (error)
        throw error;
    let doctor = yield _validation_1.Doctor.findOne({
        mobileNumber: req.body.mobileNumber,
    });
    if (doctor)
        return res
            .status(400)
            .json({ error: { mobileNumber: "Mobile Number is already exist!." } });
    let payload = lodash_1.default.pick(req.body, ["mobileNumber"]);
    payload.otp = 523322;
    let newDoctor = new _validation_1.Doctor(payload);
    newDoctor.createdAt = new Date().toISOString();
    newDoctor.updatedAt = new Date().toISOString();
    newDoctor = yield newDoctor.save();
    res.status(200).json({ message: "OTP sent successfully." });
});
exports.signup = signup;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateVerify)(req.body);
    if (error)
        throw error;
    let doctor = yield _validation_1.Doctor.findOne({
        mobileNumber: req.body.mobileNumber,
        otp: req.body.verificationCode,
    });
    if (!doctor)
        return res.status(400).json({ message: "Verification Code not matched." });
    doctor.verificationCode = "";
    // doctor.status = "success";
    doctor.updatedAt = new Date().toISOString();
    doctor = yield doctor.save();
    const token = yield doctor.getAccessToken();
    res
        .status(200)
        .setHeader("x-auth-token", token)
        .json({ message: "Doctor verified successfully." });
});
exports.verifyOtp = verifyOtp;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateMobile)(req.body);
    if (error)
        throw error;
    let doctor = yield _validation_1.Doctor.findOne({
        mobileNumber: req.body.mobileNumber,
    });
    if (!doctor)
        return res
            .status(400)
            .json({ message: "Invalid mobile number! Please try again." });
    doctor.verificationCode = 523322;
    doctor.updatedAt = new Date().toISOString();
    doctor = yield doctor.save();
    res.status(200).json({ message: "OTP sent successfully." });
});
exports.sendOtp = sendOtp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateLogin)(req.body);
    if (error)
        throw error;
    let doctors = yield _validation_1.Doctor.findOne({
        $or: [{ mobileNumber: req.body.email }, { email: req.body.email }],
    });
    if (!doctors)
        return res
            .status(400)
            .json({ message: "Invalid Email or password! Please try again." });
    let password = yield (0, encription_1.decrypt)(doctors.password);
    if (req.body.password != password)
        return res
            .status(400)
            .json({ message: "Invalid Email or password! Please try again." });
    const token = yield doctors.getAccessToken();
    res
        .status(200)
        .setHeader("x-auth-token", token)
        .json({ message: "Doctor login successfully." });
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateEmail)(req.body);
    if (error)
        throw error;
    let doctor = yield _validation_1.Doctor.findOne({ email: req.body.email });
    if (!doctor)
        return res
            .status(400)
            .json({ message: "Invalid emailAddress! Please try again." });
    doctor.verificationCode = 523322;
    doctor.updatedAt = new Date().toISOString();
    doctor = yield doctor.save();
    res
        .status(200)
        .json({ message: "Reset Password Link sent on registered email address." });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateResetPassword)(req.body);
    if (error)
        throw error;
    let doctor = yield _validation_1.Doctor.findOne({ email: req.body.email });
    if (!doctor)
        return res.status(400).json({ message: "EmailAddress not found.." });
    doctor.verificationCode = null;
    doctor.password = yield (0, encription_1.encrypt)(req.body.password);
    doctor.updatedAt = new Date().toISOString();
    doctor = yield doctor.save();
    res.status(200).json({ message: "Passsword updated successfully." });
});
exports.resetPassword = resetPassword;
