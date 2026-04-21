import { Router } from 'express';
import * as aiController from '../controllers/aiController.js';

const router = Router();

router.post('/classify', aiController.analyzeImage);

export default router;
