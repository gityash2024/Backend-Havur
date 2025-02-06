"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenNo = void 0;
const mongoose_1 = require("mongoose");
const tokenNo_1 = require("../../../models/tokenNo");
exports.TokenNo = (0, mongoose_1.model)("TokenNo", tokenNo_1.tokenNoSchema);
