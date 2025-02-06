import { Router } from "express";
import { add, list, remove, update } from "./receptionist";
const router = Router();

router.post("/list", list);
router.post("/add", add);
router.post("/update", update);
router.post("/remove", remove);

export default router;
