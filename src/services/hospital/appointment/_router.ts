import { Router } from "express";
import { add, list, view, upcoming } from "./appointment";
const router = Router();

router.post('/create', add);
router.post('/view', view);
router.post('/list', list);
router.post('/upcoming',upcoming)
export default router;