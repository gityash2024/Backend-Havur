"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateAdd = exports.Payments = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const payment_1 = require("../../../models/payment");
exports.Payments = (0, mongoose_1.model)("Payments", payment_1.paymentSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        paymentDate: joi_1.default.string().required().label("Payment Date"),
        accountId: joi_1.default.string().hex().length(24).required().label("Account ID"),
        payTo: joi_1.default.string().required().label("Pay To"),
        amount: joi_1.default.string().required().label("Amount"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateDelete = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateDelete = validateDelete;
