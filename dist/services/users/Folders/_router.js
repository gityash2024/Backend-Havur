"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const folders_1 = require("./folders");
const router = (0, express_1.Router)();
router.post("/list", folders_1.list);
router.post("/create", folders_1.add);
exports.default = router;
