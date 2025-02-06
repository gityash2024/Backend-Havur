"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentTransaction_1 = require("./appointmentTransaction");
const router = (0, express_1.Router)();
router.post("/list", appointmentTransaction_1.list);
exports.default = router;
