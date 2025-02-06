"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_1 = require("./patient");
const router = (0, express_1.Router)();
router.post('/add', patient_1.add);
router.post('/list', patient_1.list);
exports.default = router;
