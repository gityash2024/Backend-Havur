import { Router } from "express";
import { add, list } from "./folders";
const router = Router();

router.post("/list", list);
router.post("/create", add);

export default router;
