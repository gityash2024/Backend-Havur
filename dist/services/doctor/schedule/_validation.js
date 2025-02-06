"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const mongoose_1 = require("mongoose");
const schedule_1 = require("../../../models/schedule");
exports.Schedule = (0, mongoose_1.model)("Schedule", schedule_1.scheduleSchema);
