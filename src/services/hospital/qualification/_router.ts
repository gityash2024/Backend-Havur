import { Router } from "express";
import { add, list } from "./qualification";
const router = Router();

router.post("/list", list);
router.post("/add", add);

export default router;
