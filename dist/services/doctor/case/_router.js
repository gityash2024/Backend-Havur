"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientCase_1 = require("./patientCase");
const router = (0, express_1.Router)();
router.post("/list", patientCase_1.list);
exports.default = router;
