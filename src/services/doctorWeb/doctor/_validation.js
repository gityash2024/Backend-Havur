"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctors = void 0;
const mongoose_1 = require("mongoose");
const doctor_1 = require("../../../models/doctor");
exports.Doctors = (0, mongoose_1.model)("Doctors", doctor_1.doctorSchema);
