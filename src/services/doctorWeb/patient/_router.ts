import { Router } from "express";
import { add,list } from "./patient";
const router = Router();

router.post('/add', add);
router.post('/list', list);

export default router;