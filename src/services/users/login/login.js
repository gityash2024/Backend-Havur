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
exports.sendOtpMobile = exports.sendOtp = exports.resetPassword = exports.forgotPassword = exports.loginWithMobile = exports.loginWithEmail = exports.verify = exports.signup = void 0;
const _validation_1 = require("./_validation");
const encription_1 = require("../../../helper/encription");
// import Crypto from 'crypto';
const lodash_1 = __importDefault(require("lodash"));
const _validation_2 = require("../../doctor/login/_validation");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateSignup)(req.body);
    if (error)
        throw error;
    let patients = yield _validation_1.Patient.findOne({
        emailAddress: req.body.emailAddress,
    });
    if (patients)
        return res
            .status(400)
            .json({ error: { emailAddress: "Email Address is already exist." } });
    let payload = lodash_1.default.pick(req.body, [
        "firstName",
        "lastName",
        "emailAddress",
        "mobileNumber",
        "gender",
    ]);
    payload.birthDate = new Date(req.body.birthDate).toISOString();
    payload.verificationCode = 523322;
    payload.password = yield (0, encription_1.encrypt)(req.body.password);
    let newPatient = new _validation_1.Patient(payload);
    newPatient.createdAt = new Date().toISOString();
    newPatient.updatedAt = new Date().toISOString();
    let existingPatient = yield _validation_1.Patient.findOne({
        emailAddress: req.body.emailAddress,
        status: "pending",
    });
    if (existingPatient) {
        existingPatient.verificationCode = newPatient.verificationCode;
        existingPatient.updatedAt = new Date().toISOString();
        existingPatient = yield existingPatient.save();
    }
    else {
        newPatient = yield newPatient.save();
    }
    // const { mailHandler } = await import("../../../helper/mail");
    // await mailHandler(newUser.emailAddress, newUser.verificationCode);
    res.status(200).json({ message: "OTP sent successfully." });
});
exports.signup = signup;
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateVerify)(req.body);
    if (error)
        throw error;
    let patients = yield _validation_1.Patient.findOne({
        emailAddress: req.body.emailAddress,
        verificationCode: req.body.verificationCode,
    });
    if (!patients)
        return res.status(400).json({ message: "Verification Code not matched." });
    patients.verificationCode = "";
    patients.status = "success";
    patients.updatedAt = new Date().toISOString();
    patients = yield patients.save();
    res.status(200).json({ message: "Patient verified successfully." });
});
exports.verify = verify;
const loginWithEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateLogin)(req.body);
    if (error)
        throw error;
    let patients = yield _validation_1.Patient.findOne({
        $or: [
            { name: req.body.emailAddress },
            { emailAddress: req.body.emailAddress },
        ],
    });
    if (!patients)
        return res
            .status(400)
            .json({ message: "Invalid emailAddress or password! Please try again." });
    if (patients.status === "pending")
        return res.status(400).json({ message: "Email Address not verified." });
    if (patients.status === "block")
        return res.status(400).json({
            message: "Your account has been blocked! Please contact admin.",
        });
    let password = yield (0, encription_1.decrypt)(patients.password);
    if (req.body.password != password)
        return res
            .status(400)
            .json({ message: "Invalid email or password! Please try again." });
    const token = yield patients.getAccessToken();
    res
        .status(200)
        .setHeader("x-auth-token", token)
        .json({ message: "Patient login successfully." });
});
exports.loginWithEmail = loginWithEmail;
const loginWithMobile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateLoginWithMobile)(req.body);
    if (error)
        throw error;
    let patients = yield _validation_1.Patient.findOne({
        mobileNumber: req.body.mobileNumber,
    });
    if (!patients)
        return res
            .status(400)
            .json({ message: "Invalid mobile number or otp! Please try again." });
    if (req.body.verificationCode != patients.verificationCode)
        return res
            .status(400)
            .json({ message: "Invalid mobile number or otp! Please try again." });
    const token = yield patients.getAccessToken();
    res
        .status(200)
        .setHeader("x-auth-token", token)
        .json({ message: "Patient login successfully." });
});
exports.loginWithMobile = loginWithMobile;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateEmail)(req.body);
    if (error)
        throw error;
    let patients = yield _validation_1.Patient.findOne({
        emailAddress: req.body.emailAddress,
    });
    if (!patients)
        return res
            .status(400)
            .json({ message: "Invalid emailAddress! Please try again." });
    patients.verificationCode = 523322;
    patients.updatedAt = new Date().toISOString();
    patients = yield patients.save();
    res
        .status(200)
        .json({ message: "Reset Password Link sent on registered email address." });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateResetPassword)(req.body);
    if (error)
        throw error;
    let patients = yield _validation_1.Patient.findOne({
        emailAddress: req.body.emailAddress,
    });
    if (!patients)
        return res.status(400).json({ message: "EmailAddress not found.." });
    patients.verificationCode = null;
    patients.password = yield (0, encription_1.encrypt)(req.body.password);
    patients.updatedAt = new Date().toISOString();
    patients = yield patients.save();
    res.status(200).json({ message: "Passsword updated successfully." });
});
exports.resetPassword = resetPassword;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateEmail)(req.body);
    if (error)
        throw error;
    let patients = yield _validation_1.Patient.findOne({
        emailAddress: req.body.emailAddress,
    });
    if (!patients)
        return res
            .status(400)
            .json({ message: "Invalid Email Address! Please try again." });
    patients.verificationCode = 523322;
    patients.updatedAt = new Date().toISOString();
    patients = yield patients.save();
    res.status(200).json({ message: "OTP sent successfully." });
});
exports.sendOtp = sendOtp;
const sendOtpMobile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_2.validateMobile)(req.body);
    if (error)
        throw error;
    let patients = yield _validation_1.Patient.findOne({
        mobileNumber: req.body.mobileNumber,
    });
    if (!patients)
        return res
            .status(400)
            .json({ message: "Invalid Mobile Number! Please try again." });
    patients.verificationCode = 523322;
    patients.updatedAt = new Date().toISOString();
    patients = yield patients.save();
    res.status(200).json({ message: "OTP sent successfully." });
});
exports.sendOtpMobile = sendOtpMobile;
