import { Router } from 'express';
import { add, list, view, remove, update } from './hospital';


const router = Router();

router.post('/create', add);
router.post('/list', list);
router.post('/view', view);
router.post('/delete', remove);
router.post('/update', update);

export default router;