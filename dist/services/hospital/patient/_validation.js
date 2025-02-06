"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdd = exports.Patient = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const patient_1 = require("../../../models/patient");
exports.Patient = (0, mongoose_1.model)("Patient", patient_1.patientSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required().label("First Name"),
        lastName: joi_1.default.string().required().label("Last Name"),
        emailAddress: joi_1.default.string().required().email().label("Email Address"),
        password: joi_1.default.string().required().label("Password"),
        confirmPassword: joi_1.default.string().required().label("Confirm Password"),
        mobileNumber: joi_1.default.string().required().label("Mobile Number"),
        gender: joi_1.default.string().required().label("Gender"),
        birthDate: joi_1.default.string().required().label("Date of Birth"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
