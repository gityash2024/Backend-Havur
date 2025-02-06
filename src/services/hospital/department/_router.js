"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const department_1 = require("./department");
const router = (0, express_1.Router)();
router.post("/list", department_1.list);
router.post("/add", department_1.add);
exports.default = router;
