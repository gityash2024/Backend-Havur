import { Router } from "express";
import {
  add,
  list,
  remove,
  removePrescriptionMedicines,
  update,
} from "./prescription";
const router = Router();

router.post("/list", list);
router.post("/add", add);
router.post("/update", update);
router.post("/remove", remove);
router.post("/remove-prescription-medicine", removePrescriptionMedicines);

export default router;
