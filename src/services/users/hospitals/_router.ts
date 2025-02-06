import { Router } from 'express';
import { associatedDoctors, list, view } from './hospitals';


const router = Router();


router.post('/list', list);
router.post('/view', view);
router.post('/associated_doctors', associatedDoctors);

export default router;