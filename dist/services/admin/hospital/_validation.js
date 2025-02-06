"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdate = exports.validateDelete = exports.validateAdd = exports.validateView = exports.Doctors = exports.Hospitals = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const hospital_1 = require("../../../models/hospital");
const doctor_1 = require("../../../models/doctor");
exports.Hospitals = (0, mongoose_1.model)("Hospitals", hospital_1.hospitalSchema);
exports.Doctors = (0, mongoose_1.model)("Doctors", doctor_1.doctorSchema);
const validateView = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateView = validateView;
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().label("Name"),
        emailAddress: joi_1.default.string().email().required().label("Email address"),
        password: joi_1.default.string().required().label("password"),
        mobileNumber: joi_1.default.string().required().label("Mobile Number"),
        address: joi_1.default.string().required().label("Address"),
        location: joi_1.default.string().required().label("Location"),
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
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        hospitalId: joi_1.default.string().hex().length(24).required().label("Hospital ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
