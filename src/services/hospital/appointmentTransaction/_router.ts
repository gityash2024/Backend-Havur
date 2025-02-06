import { Router } from "express";
import { list } from "./appointmentTransaction";
const router = Router();

router.post("/list", list);

export default router;
