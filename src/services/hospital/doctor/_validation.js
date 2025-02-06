"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdd = exports.validateAcceptdoctor = exports.Hospitals = exports.Doctors = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const doctor_1 = require("../../../models/doctor");
const hospital_1 = require("../../../models/hospital");
exports.Doctors = (0, mongoose_1.model)("Doctors", doctor_1.doctorSchema);
exports.Hospitals = (0, mongoose_1.model)("Hospitals", hospital_1.hospitalSchema);
const validateAcceptdoctor = (data) => {
    const schema = joi_1.default.object({
        did: joi_1.default.string().required().label("Doctor ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAcceptdoctor = validateAcceptdoctor;
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required().label("First Name"),
        lastName: joi_1.default.string().required().label("Last Name"),
        department: joi_1.default.string().required().label("Department"),
        email: joi_1.default.string().required().email().label("Email Id"),
        mobileNumber: joi_1.default.string().required().label("Mobile Number"),
        designation: joi_1.default.string().required().label("Designation"),
        qualification: joi_1.default.string().required().label("Qualification"),
        specialization: joi_1.default.string().required().label("Specialization"),
        password: joi_1.default.string().required().label("Password"),
        confirmPassword: joi_1.default.string().required().label("confirmPassword"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
