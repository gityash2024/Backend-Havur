"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Specialization = void 0;
const mongoose_1 = require("mongoose");
const specialization_1 = require("../../../models/specialization");
exports.Specialization = (0, mongoose_1.model)("Specialization", specialization_1.specializationSchema);
