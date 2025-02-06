"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bed_1 = require("./bed");
const router = (0, express_1.Router)();
router.post("/list", bed_1.list);
exports.default = router;
