"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdate = exports.Patients = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const patient_1 = require("../../../models/patient");
exports.Patients = (0, mongoose_1.model)('Patients', patient_1.patientSchema);
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required().label('First Name'),
        middleName: joi_1.default.string().required().label('Middle Name'),
        lastName: joi_1.default.string().required().label('Last Name'),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
