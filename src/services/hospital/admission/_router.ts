import { Router } from "express";
import { add, list, patientViseAdmissionList, view } from "./admission";
const router = Router();

router.post("/add", add);
router.post("/list", list);
router.post("/patient-vise-admission", patientViseAdmissionList);
router.post("/view", view);

export default router;
