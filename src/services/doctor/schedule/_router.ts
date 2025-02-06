import { Router } from "express";
import { add, addSchedule, list, update } from "./schedule";

const router = Router();

router.post("/list", list);
router.post("/add", add);
router.post("/create", addSchedule);
router.post("/update", update);

export default router;
