import { Router } from "express";
import { add,list,acceptDoctor } from "./doctor";
const router = Router();

router.post('/add', add);
router.post('/list', list);
router.post('/accept_doctor', acceptDoctor);

export default router;