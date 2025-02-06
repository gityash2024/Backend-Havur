import { Router } from "express";
import { add, bedTypelist, list, remove, update } from "./bed";
const router = Router();

router.post("/list", list);
router.post("/bed_type_according/list", bedTypelist);
router.post("/add", add);
router.post("/update", update);
router.post("/remove", remove);

export default router;
