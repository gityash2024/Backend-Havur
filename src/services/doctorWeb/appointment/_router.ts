import { Router } from "express";
import {
  list,
  view,
  uploadFile,
  updatePatient,
  UpcomingList,
} from "./appointment";

const router = Router();

router.post("/list", list);
router.post("/upcoming", UpcomingList);
router.post("/view", view);
router.post("/uploadFile", uploadFile); // for prescription upload
router.post("/updatePatient", updatePatient);
export default router;
