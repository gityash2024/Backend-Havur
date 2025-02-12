"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accounts_1 = require("./accounts");
const router = (0, express_1.Router)();
router.post("/list", accounts_1.list);
router.post("/add", accounts_1.add);
router.post("/update", accounts_1.update);
router.post("/remove", accounts_1.remove);
exports.default = router;
