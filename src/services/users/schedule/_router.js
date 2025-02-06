"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schedule_1 = require("./schedule");
const router = (0, express_1.Router)();
router.post("/list", schedule_1.list);
exports.default = router;
