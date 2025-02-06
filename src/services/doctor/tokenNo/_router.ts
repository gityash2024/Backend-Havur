import { Router } from "express";
import {
  add,
  countTokensToday,
  currentToken,
  HospitalCurrentToken,
  list,
} from "./tokenNo";
const router = Router();

router.post("/add", add);
router.post("/list", list);
router.post("/total", countTokensToday);
router.post("/current", currentToken);
router.post("/hospital", HospitalCurrentToken);

export default router;
