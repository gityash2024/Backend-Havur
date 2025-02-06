import { Router } from "express";
import { associatedHospitals, joinHospital ,list} from "./hospital";
const router = Router();

router.post('/associated_hospitals', associatedHospitals);
router.post('/join_hospital', joinHospital);
router.post('/list',list);


export default router;