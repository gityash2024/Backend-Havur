"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hospital_1 = require("./hospital");
const router = (0, express_1.Router)();
router.post('/associated_hospitals', hospital_1.associatedHospitals);
router.post('/join_hospital', hospital_1.joinHospital);
router.post('/list', hospital_1.list);
exports.default = router;
