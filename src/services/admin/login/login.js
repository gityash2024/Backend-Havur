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
exports.resetPassword = exports.forgotPassword = exports.login = exports.signup = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const encription_1 = require("../../../helper/encription");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateSignup)(req.body);
    if (error)
        throw error;
    let adminEmail = yield _validation_1.Admin.findOne({ emailAddress: req.body.emailAddress });
    if (adminEmail)
        return res.status(400).json({ error: { emailAddress: 'Email Address is already exist!.' } });
    let adminUsername = yield _validation_1.Admin.findOne({ userName: req.body.userName });
    if (adminUsername)
        return res.status(400).json({ error: { userName: 'User Name is already exist!.' } });
    let payload = lodash_1.default.pick(req.body, [
        "userName", "emailAddress"
    ]);
    payload.password = yield (0, encription_1.encrypt)(req.body.password);
    let newAdmin = new _validation_1.Admin(payload);
    newAdmin.createdAt = new Date().toISOString();
    newAdmin.updatedAt = new Date().toISOString();
    newAdmin = yield newAdmin.save();
    res.status(200).json({ message: "Sign up Successfully..." });
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateLogin)(req.body);
    if (error)
        throw error;
    let admins = yield _validation_1.Admin.findOne({ $or: [{ userName: req.body.userName }, { emailAddress: req.body.userName }] });
    if (!admins)
        return res.status(400).json({ message: 'No User Found' });
    let password = yield (0, encription_1.decrypt)(admins.password);
    if (req.body.password != password)
        return res.status(400).json({ message: "Invalid email or password! Please try again." });
    const token = yield admins.getAccessToken();
    res.status(200).setHeader("x-auth-token", token).json({ message: "Admin login successfully." });
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateEmail)(req.body);
    if (error)
        throw error;
    let admin = yield _validation_1.Admin.findOne({ emailAddress: req.body.emailAddress });
    if (!admin)
        return res.status(400).json({ message: 'Invalid emailAddress! Please try again.' });
    admin.verificationCode = 523322;
    admin.updatedAt = new Date().toISOString();
    admin = yield admin.save();
    res.status(200).json({ message: "Reset Password Link sent on registered email address." });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateResetPassword)(req.body);
    if (error)
        throw error;
    let admin = yield _validation_1.Admin.findOne({ emailAddress: req.body.emailAddress });
    if (!admin)
        return res.status(400).json({ message: 'EmailAddress not found..' });
    admin.verificationCode = null;
    admin.password = yield (0, encription_1.encrypt)(req.body.password);
    admin.updatedAt = new Date().toISOString();
    admin = yield admin.save();
    res.status(200).json({ message: "Passsword updated successfully." });
});
exports.resetPassword = resetPassword;
