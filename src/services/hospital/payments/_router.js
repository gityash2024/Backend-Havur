"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payments_1 = require("./payments");
const router = (0, express_1.Router)();
router.post("/list", payments_1.list);
router.post("/add", payments_1.add);
router.post("/update", payments_1.update);
router.post("/remove", payments_1.remove);
exports.default = router;
