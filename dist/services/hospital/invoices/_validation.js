"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateAdd = exports.InvoiceItems = exports.Invoices = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const invoices_1 = require("../../../models/invoices");
const invoiceItems_1 = require("../../../models/invoiceItems");
exports.Invoices = (0, mongoose_1.model)("Invoices", invoices_1.invoiceSchema);
exports.InvoiceItems = (0, mongoose_1.model)("InvoiceItems", invoiceItems_1.invoiceItemSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        patientId: joi_1.default.string().hex().length(24).required().label("Patient"),
        invoiceId: joi_1.default.string().required().label("Invoice Id"),
        invoiceDate: joi_1.default.string().required().label("Invoice Date"),
        amount: joi_1.default.number().required().label("Amount"),
        discount: joi_1.default.number().required().label("Discount"),
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
