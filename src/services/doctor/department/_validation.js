"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Department = void 0;
const mongoose_1 = require("mongoose");
const department_1 = require("../../../models/department");
exports.Department = (0, mongoose_1.model)("Department", department_1.departmentSchema);
