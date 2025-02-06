"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bedType_1 = require("./bedType");
const router = (0, express_1.Router)();
router.post("/list", bedType_1.list);
exports.default = router;
