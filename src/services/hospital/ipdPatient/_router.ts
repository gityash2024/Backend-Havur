import { Router } from "express";
import { add, associatedIpdList, list, remove, update } from "./ipdPatient";
const router = Router();

router.post("/list", list);
router.post("/associate/list", associatedIpdList);
router.post("/add", add);
router.post("/update", update);
router.post("/remove", remove);

export default router;
