"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientCase = void 0;
const mongoose_1 = require("mongoose");
const patientCase_1 = require("../../../models/patientCase");
exports.PatientCase = (0, mongoose_1.model)("PatientCase", patientCase_1.patientCaseSchema);
