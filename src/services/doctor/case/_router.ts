import { Router } from "express";
import { list } from "./patientCase";
const router = Router();

router.post("/list", list);

export default router;
