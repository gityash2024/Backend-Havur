import { Router } from "express";
import { list } from "./doctor";
const router = Router();

router.post("/list", list);

export default router;
