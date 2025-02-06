import { Router } from "express";
import { add, list } from "./specialization";
const router = Router();

router.post("/list", list);
router.post("/add", add);

export default router;
