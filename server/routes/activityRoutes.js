import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { exportActivitiesCSV, getActivity } from '../controllers/activityControllers.js';

const router = express.Router();
router.get('/activity', verifyToken, getActivity);
router.get('/export', verifyToken, exportActivitiesCSV)

export default router;