"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const specialization_1 = require("./specialization");
const router = (0, express_1.Router)();
router.post("/list", specialization_1.list);
router.post("/add", specialization_1.add);
exports.default = router;
