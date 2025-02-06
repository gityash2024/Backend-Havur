"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Folders = void 0;
const mongoose_1 = require("mongoose");
const folderOfPatient_1 = require("../../../models/folderOfPatient");
exports.Folders = (0, mongoose_1.model)("Folders", folderOfPatient_1.folderSchema);
