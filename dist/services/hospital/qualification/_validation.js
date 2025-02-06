"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Qualification = void 0;
const mongoose_1 = require("mongoose");
const qualification_1 = require("../../../models/qualification");
exports.Qualification = (0, mongoose_1.model)("Qualification", qualification_1.qualificationSchema);
