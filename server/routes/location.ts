import { Router } from 'express';
import { getLocation, updateLocation } from '../controllers/locationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getLocation);
router.put('/', authenticateToken, updateLocation);

export { router as locationRouter };