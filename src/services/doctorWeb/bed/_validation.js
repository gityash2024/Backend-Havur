"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bed = void 0;
const mongoose_1 = require("mongoose");
const bed_1 = require("../../../models/bed");
exports.Bed = (0, mongoose_1.model)("Bed", bed_1.bedSchema);
