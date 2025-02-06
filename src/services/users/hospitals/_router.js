"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hospitals_1 = require("./hospitals");
const router = (0, express_1.Router)();
router.post('/list', hospitals_1.list);
router.post('/view', hospitals_1.view);
router.post('/associated_doctors', hospitals_1.associatedDoctors);
exports.default = router;
