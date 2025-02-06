import { Router } from "express";
import {
  update,
  view,
  uploadFile,
  deleteFile,
  viewMfile,
  updateSelectedHospital,
} from "./profile";
const router = Router();

router.post("/view", view);
router.post("/update", update);
router.post("/uploadFile", uploadFile);
router.post("/deleteFile", deleteFile);
router.post("/viewMfile", viewMfile);
router.post("/select-hosital", updateSelectedHospital);
export default router;
