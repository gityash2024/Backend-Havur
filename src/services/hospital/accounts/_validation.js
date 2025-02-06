"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelete = exports.validateUpdate = exports.validateAdd = exports.Accounts = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const accounts_1 = require("../../../models/accounts");
exports.Accounts = (0, mongoose_1.model)("Accounts", accounts_1.accountsSchema);
const validateAdd = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().label("Name"),
        type: joi_1.default.string().required().label("Type"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateAdd = validateAdd;
const validateUpdate = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().label("Name"),
        type: joi_1.default.string().required().label("Type"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateUpdate = validateUpdate;
const validateDelete = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().hex().length(24).required().label("ID"),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
exports.validateDelete = validateDelete;
