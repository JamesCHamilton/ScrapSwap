import { Router } from 'express';
import * as impactController from '../controllers/impactController.js';

const router = Router();

router.post('/report', impactController.createImpactReport);
router.get('/user/:userId', impactController.getUserImpact);

export default router;
