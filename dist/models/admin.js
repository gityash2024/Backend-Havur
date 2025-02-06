"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSchema = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("config"));
const encription_1 = require("../helper/encription");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.adminSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    userName: { type: String, default: "" },
    emailAddress: { type: String, required: [true, "Email address required."] },
    password: { type: String, required: [true, "Password required."] },
    verificationCode: { type: String, default: null },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
}, { collection: "admin" });
exports.adminSchema.methods.getAccessToken = function () {
    const token = jsonwebtoken_1.default.sign({ aid: this._id }, config_1.default.get("jwtPrivateKey"));
    return (0, encription_1.encrypt)(token);
};
