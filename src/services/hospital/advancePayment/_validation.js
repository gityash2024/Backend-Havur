"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateAdd = exports.AdvancePayment = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const advancePayment_1 = require("../../../models/advancePayment");
exports.AdvancePayment = (0, mongoose_1.model)("AdvancePayment", advancePayment_1.advancePaymentSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        paymentDate: joi_1.default.string().required().label("Payment Date"),
        patientId: joi_1.default.string().hex().length(24).required().label("Patient ID"),
        receiptNo: joi_1.default.string().required().label("ReceiptNo"),
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
