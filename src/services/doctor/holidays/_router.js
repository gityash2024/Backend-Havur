"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const holidays_1 = require("./holidays");
const router = (0, express_1.Router)();
router.post("/list", holidays_1.list);
router.post("/add", holidays_1.add);
router.post("/remove", holidays_1.remove);
exports.default = router;
