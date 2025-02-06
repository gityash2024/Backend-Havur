"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BedType = void 0;
const mongoose_1 = require("mongoose");
const bedType_1 = require("../../../models/bedType");
exports.BedType = (0, mongoose_1.model)("BedType", bedType_1.bedTypeSchema);
