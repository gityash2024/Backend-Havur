"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_1 = require("./doctor");
const router = (0, express_1.Router)();
router.post('/add', doctor_1.add);
router.post('/list', doctor_1.list);
router.post('/accept_doctor', doctor_1.acceptDoctor);
exports.default = router;
