"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateView = exports.Doctor = exports.Hospital = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const hospital_1 = require("../../../models/hospital");
const doctor_1 = require("../../../models/doctor");
exports.Hospital = (0, mongoose_1.model)('Hospital', hospital_1.hospitalSchema);
exports.Doctor = (0, mongoose_1.model)('Doctors', doctor_1.doctorSchema);
const validateView = (data) => {
    const schema = joi_1.default.object({
        hid: joi_1.default.string().hex().length(24).required().label('ID')
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateView = validateView;
