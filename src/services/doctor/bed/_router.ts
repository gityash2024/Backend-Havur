import { Router } from "express";
import { list } from "./bed";

const router = Router();

router.post("/list", list);

export default router;
