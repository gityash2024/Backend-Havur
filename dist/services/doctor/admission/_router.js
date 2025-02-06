"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admission_1 = require("./admission");
const router = (0, express_1.Router)();
router.post('/add', admission_1.add);
router.post('/list', admission_1.list);
exports.default = router;
