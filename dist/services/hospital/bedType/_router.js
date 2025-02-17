"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bedType_1 = require("./bedType");
const router = (0, express_1.Router)();
router.post("/list", bedType_1.list);
router.post("/add", bedType_1.add);
router.post("/update", bedType_1.update);
router.post("/remove", bedType_1.remove);
exports.default = router;
