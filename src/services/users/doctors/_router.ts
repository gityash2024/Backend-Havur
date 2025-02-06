import { Router } from 'express';
import { associatedHospitals , list, view } from './doctor';


const router = Router();

router.post('/list', list);
router.post('/view', view);
router.post('/associated_hospital', associatedHospitals);

export default router;