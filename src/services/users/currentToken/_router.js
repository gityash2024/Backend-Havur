"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const currentToken_1 = require("./currentToken");
const router = (0, express_1.Router)();
router.post("/token", currentToken_1.list);
exports.default = router;
