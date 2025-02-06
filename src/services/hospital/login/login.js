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
exports.sendOtp = exports.resetPassword = exports.forgotPassword = exports.login = void 0;
const _validation_1 = require("./_validation");
const encription_1 = require("../../../helper/encription");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateLogin)(req.body);
    if (error)
        throw error;
    let hospital = yield _validation_1.Hospital.findOne({ $or: [{ name: req.body.name }, { emailAddress: req.body.name }] });
    if (!hospital)
        return res.status(400).json({ message: 'No User Found' });
    let password = yield (0, encription_1.decrypt)(hospital.password);
    if (req.body.password != password)
        return res.status(400).json({ message: "Invalid email or password! Please try again." });
    const token = yield hospital.getAccessToken();
    res.status(200).setHeader("x-auth-token", token).json({ message: "Hospital login successfully." });
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateEmail)(req.body);
    if (error)
        throw error;
    let hospital = yield _validation_1.Hospital.findOne({ emailAddress: req.body.emailAddress });
    if (!hospital)
        return res.status(400).json({ message: 'Invalid emailAddress! Please try again.' });
    hospital.verificationCode = 523322;
    hospital.updatedAt = new Date().toISOString();
    hospital = yield hospital.save();
    res.status(200).json({ message: "Reset Password Link sent on registered email address." });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateResetPassword)(req.body);
    if (error)
        throw error;
    let hospital = yield _validation_1.Hospital.findOne({ emailAddress: req.body.emailAddress });
    if (!hospital)
        return res.status(400).json({ message: 'EmailAddress not found..' });
    hospital.verificationCode = null;
    hospital.password = yield (0, encription_1.encrypt)(req.body.password);
    hospital.updatedAt = new Date().toISOString();
    hospital = yield hospital.save();
    res.status(200).json({ message: "Passsword updated successfully." });
});
exports.resetPassword = resetPassword;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateEmail)(req.body);
    if (error)
        throw error;
    let hospital = yield _validation_1.Hospital.findOne({ emailAddress: req.body.emailAddress });
    if (!hospital)
        return res.status(400).json({ message: 'Invalid emailAddress! Please try again.' });
    hospital.verificationCode = 523322;
    hospital.updatedAt = new Date().toISOString();
    hospital = yield hospital.save();
    res.status(200).json({ message: "OTP sent successfully." });
});
exports.sendOtp = sendOtp;
