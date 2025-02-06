"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateAdd = exports.BedAssign = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const bedAssign_1 = require("../../../models/bedAssign");
exports.BedAssign = (0, mongoose_1.model)("BedAssign", bedAssign_1.bedAssignSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        bed: joi_1.default.string().hex().length(24).required().label("Bed"),
        case: joi_1.default.string().hex().length(24).required().label("Case"),
        ipdPatient: joi_1.default.string().hex().length(24).required().label("IPD Patient"),
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
