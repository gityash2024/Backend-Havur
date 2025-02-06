"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qualification_1 = require("./qualification");
const router = (0, express_1.Router)();
router.post("/list", qualification_1.list);
router.post("/add", qualification_1.add);
exports.default = router;
