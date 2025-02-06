"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdate = exports.Doctor = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const doctor_1 = require("../../../models/doctor");
exports.Doctor = (0, mongoose_1.model)("Doctors", doctor_1.doctorSchema);
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required().label("First Name"),
        lastName: joi_1.default.string().required().label("Last Name"),
        qualification: joi_1.default.string().required().label("Qualification"),
        specialization: joi_1.default.string().required().label("Specialization"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
