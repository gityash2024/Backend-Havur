import { Router } from "express";
import { list } from "./bedType";

const router = Router();

router.post("/list", list);

export default router;
