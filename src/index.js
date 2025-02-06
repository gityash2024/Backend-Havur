"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const db_1 = __importDefault(require("./startup/db"));
const error_1 = __importDefault(require("./startup/error"));
const models_1 = __importDefault(require("./startup/models"));
const router_1 = __importDefault(require("./startup/router"));
const app = (0, express_1.default)();
(0, db_1.default)();
(0, models_1.default)();
(0, router_1.default)(app);
(0, error_1.default)();
const port = process.env.PORT || config_1.default.get("port");
app.listen(port, () => console.log(`connnected on port ${port}`));
