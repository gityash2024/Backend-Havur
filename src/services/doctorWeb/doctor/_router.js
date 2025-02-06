"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_1 = require("./doctor");
const router = (0, express_1.Router)();
router.post("/list", doctor_1.list);
exports.default = router;
