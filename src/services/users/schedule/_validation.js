"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Holidays = exports.Schedule = void 0;
const mongoose_1 = require("mongoose");
const schedule_1 = require("../../../models/schedule");
const doctorHolidays_1 = require("../../../models/doctorHolidays");
exports.Schedule = (0, mongoose_1.model)("Schedule", schedule_1.scheduleSchema);
exports.Holidays = (0, mongoose_1.model)("Holidays", doctorHolidays_1.holidaySchema);
