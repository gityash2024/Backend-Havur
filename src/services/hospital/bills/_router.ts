import { Router } from "express";
import {
  add,
  billTransactionList,
  list,
  remove,
  removeBillItems,
  update,
} from "./bills";
const router = Router();

router.post("/list", list);
router.post("/add", add);
router.post("/update", update);
router.post("/remove", remove);
router.post("/remove-bill-item", removeBillItems);
router.post("/bill-transaction", billTransactionList);

export default router;
