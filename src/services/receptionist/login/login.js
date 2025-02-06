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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.sendOtp = exports.verifyOtp = void 0;
const _validation_1 = require("./_validation");
const encription_1 = require("../../../helper/encription");
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateVerify)(req.body);
    if (error)
        throw error;
    let user = yield _validation_1.Users.findOne({
        email: req.body.email,
        otp: req.body.otp,
    });
    if (!user)
        return res.status(400).json({ message: "Verification Code not matched." });
    user.verificationCode = "";
    // user.status = "success";
    user.updatedAt = new Date().toISOString();
    user = yield user.save();
    res.status(200).json({ message: "User verified successfully." });
});
exports.verifyOtp = verifyOtp;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateEmail)(req.body);
    if (error)
        throw error;
    let user = yield _validation_1.Users.findOne({
        email: req.body.email,
    });
    if (!user)
        return res
            .status(400)
            .json({ message: "Invalid email! Please try again." });
    user.otp = 523322;
    user.updatedAt = new Date().toISOString();
    user = yield user.save();
    res.status(200).json({ message: "OTP sent successfully." });
});
exports.sendOtp = sendOtp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateLogin)(req.body);
    if (error)
        throw error;
    let user = yield _validation_1.Users.findOne({
        email: req.body.email,
    });
    if (!user)
        return res
            .status(400)
            .json({ message: "Invalid Email or password! Please try again." });
    let password = yield (0, encription_1.decrypt)(user.password);
    if (req.body.password != password)
        return res
            .status(400)
            .json({ message: "Invalid Email or password! Please try again." });
    const token = yield user.getAccessToken();
    res
        .status(200)
        .setHeader("x-auth-token", token)
        .json({ message: "Receptionist login successfully." });
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateEmail)(req.body);
    if (error)
        throw error;
    let user = yield _validation_1.Users.findOne({ email: req.body.email });
    if (!user)
        return res
            .status(400)
            .json({ message: "Invalid emailAddress! Please try again." });
    user.otp = 523322;
    user.updatedAt = new Date().toISOString();
    user = yield user.save();
    res
        .status(200)
        .json({ message: "Reset Password Link sent on registered email address." });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateResetPassword)(req.body);
    if (error)
        throw error;
    let users = yield _validation_1.Users.findOne({ email: req.body.email });
    if (!users)
        return res.status(400).json({ message: "Email not found.." });
    users.otp = null;
    users.password = yield (0, encription_1.encrypt)(req.body.password);
    users.updatedAt = new Date().toISOString();
    users = yield users.save();
    res.status(200).json({ message: "Passsword updated successfully." });
});
exports.resetPassword = resetPassword;
