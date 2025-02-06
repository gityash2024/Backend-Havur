"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.PrescriptionsMedicines = exports.Prescriptions = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const prescription_1 = require("../../../models/prescription");
const prescriptionsMedicines_1 = require("../../../models/prescriptionsMedicines");
exports.Prescriptions = (0, mongoose_1.model)("Prescriptions", prescription_1.prescriptionsSchema);
exports.PrescriptionsMedicines = (0, mongoose_1.model)("PrescriptionsMedicines", prescriptionsMedicines_1.prescriptionsMedicinesSchema);
const validateDelete = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateDelete = validateDelete;
