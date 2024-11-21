import { Router } from 'express';
import { getSkills, createSkill } from '../controllers/skillController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getSkills);
router.post('/', authenticateToken, createSkill);

export { router as skillRouter };