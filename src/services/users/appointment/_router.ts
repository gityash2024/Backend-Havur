import { Router } from "express";
import { add, cancel, list, reschedule, view } from "./appointment";
const router = Router();

router.post("/create", add);
router.post("/view", view);
router.post("/list", list);
router.post("/cancel", cancel);
router.post("/reschedule", reschedule);

export default router;
