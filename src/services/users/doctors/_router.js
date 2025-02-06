"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_1 = require("./doctor");
const router = (0, express_1.Router)();
router.post('/list', doctor_1.list);
router.post('/view', doctor_1.view);
router.post('/associated_hospital', doctor_1.associatedHospitals);
exports.default = router;
