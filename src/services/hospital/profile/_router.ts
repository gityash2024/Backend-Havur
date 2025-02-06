import { Router } from "express";
import { update,view } from "./profile";
const router = Router();

router.post('/update', update);
router.post('/view', view);


export default router;