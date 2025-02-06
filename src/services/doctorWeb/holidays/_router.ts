import { Router } from "express";
import { add, list, remove } from "./holidays";

const router = Router();

router.post("/list", list);
router.post("/add", add);
router.post("/remove", remove);

export default router;
