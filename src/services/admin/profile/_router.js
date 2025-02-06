"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_1 = require("./profile");
const router = (0, express_1.Router)();
router.post("/update", profile_1.update);
router.post("/view", profile_1.view);
router.post("/upload", profile_1.uploadFile);
exports.default = router;
