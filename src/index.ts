import express, { Application } from "express";
import config from "config";
import db from "./startup/db";
import errorHandler from "./startup/error";
import models from "./startup/models";
import routes from "./startup/router";

const app: Application = express();

db();
models();
routes(app);
errorHandler();

const port = process.env.PORT || config.get("port");
app.listen(port, () => console.log(`connnected on port ${port}`));
