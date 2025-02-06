"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_1 = require("./appointment");
const router = (0, express_1.Router)();
router.post("/list", appointment_1.list);
router.post("/upcoming", appointment_1.UpcomingList);
router.post("/view", appointment_1.view);
router.post("/uploadFile", appointment_1.uploadFile); // for prescription upload
router.post("/updatePatient", appointment_1.updatePatient);
exports.default = router;
