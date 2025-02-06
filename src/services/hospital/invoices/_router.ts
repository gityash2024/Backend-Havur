import { Router } from "express";
import { add, list, remove, removeBillItems, update } from "./invoices";
const router = Router();

router.post("/list", list);
router.post("/add", add);
router.post("/update", update);
router.post("/remove", remove);
router.post("/remove-invoice-item", removeBillItems);

export default router;
