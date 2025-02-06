import cors from "cors";
import express, { Application, json, Request, Response } from "express";
import helmet from "helmet";
import { errorHandler } from "../middleware/error";
import router from "../services/routes";
import path from "path";

export default (app: Application) => {
  app.use(helmet());
  app.use(json());
  app.use(cors({
    origin: "https://admin-havur.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use("/files", express.static(path.join(__dirname, "../../files")));
  app.use("/", router);
  app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "URL not found." });
  });

  app.use(errorHandler);
};
