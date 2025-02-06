import { Router } from "express";
import { update, view, uploadFile, deleteFile } from "./profile";
const router = Router();

router.post("/view", view);
router.post("/update", update);
router.post("/uploadFile", uploadFile);
router.post("/deleteFile", deleteFile);
export default router;
