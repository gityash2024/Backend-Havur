"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdd = exports.Appointment = exports.TokenNo = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const tokenNo_1 = require("../../../models/tokenNo");
const appointment_1 = require("../../../models/appointment");
exports.TokenNo = (0, mongoose_1.model)("TokenNo", tokenNo_1.tokenNoSchema);
exports.Appointment = (0, mongoose_1.model)("Appointment", appointment_1.appointmentSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        hospitalId: joi_1.default.string().hex().required().length(24).label("Hospital ID"),
        tokenNo: joi_1.default.number().required().label("Token No"),
        date: joi_1.default.string().required().label("Admission Date"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
