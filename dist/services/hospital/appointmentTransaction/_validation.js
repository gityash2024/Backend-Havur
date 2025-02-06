"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentTransaction = void 0;
const mongoose_1 = require("mongoose");
const appointmentTransaction_1 = require("../../../models/appointmentTransaction");
exports.AppointmentTransaction = (0, mongoose_1.model)("AppointmentTransaction", appointmentTransaction_1.appointmentTransactionsSchema);
