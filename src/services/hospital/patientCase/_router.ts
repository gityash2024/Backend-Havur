import { Router } from "express";
import { add, IpdOpdCaselist, list, remove, update } from "./patientCase";
const router = Router();

router.post("/list", list);
router.post("/patient_by/list", IpdOpdCaselist);
router.post("/add", add);
router.post("/update", update);
router.post("/remove", remove);

export default router;
