"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateAdd = exports.BillTransaction = exports.BillItems = exports.Bills = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const bills_1 = require("../../../models/bills");
const billItems_1 = require("../../../models/billItems");
const billTransaction_1 = require("../../../models/billTransaction");
exports.Bills = (0, mongoose_1.model)("Bills", bills_1.billsSchema);
exports.BillItems = (0, mongoose_1.model)("BillItems", billItems_1.billItemsSchema);
exports.BillTransaction = (0, mongoose_1.model)("BillTransaction", billTransaction_1.billTransactionSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        patientId: joi_1.default.string().hex().length(24).required().label("Patient"),
        patientAdmissionId: joi_1.default.string()
            .hex()
            .length(24)
            .required()
            .label("Admission"),
        billDate: joi_1.default.string().required().label("Bill Date"),
        amount: joi_1.default.number().required().label("Amount"),
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
