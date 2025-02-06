"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Holidays = void 0;
const mongoose_1 = require("mongoose");
const doctorHolidays_1 = require("../../../models/doctorHolidays");
exports.Holidays = (0, mongoose_1.model)("Holidays", doctorHolidays_1.holidaySchema);
