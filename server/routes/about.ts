import { Router } from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../controllers/experienceController';
import { getEducation, createEducation, updateEducation, deleteEducation } from '../controllers/educationController';
import { getTechStack, createTechStack, updateTechStack, deleteTechStack } from '../controllers/techStackController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// About routes
router.get('/', getAbout);
router.put('/', authenticateToken, updateAbout);

// Experience routes
router.get('/experiences', getExperiences);
router.post('/experiences', authenticateToken, createExperience);
router.put('/experiences/:id', authenticateToken, updateExperience);
router.delete('/experiences/:id', authenticateToken, deleteExperience);

// Education routes
router.get('/education', getEducation);
router.post('/education', authenticateToken, createEducation);
router.put('/education/:id', authenticateToken, updateEducation);
router.delete('/education/:id', authenticateToken, deleteEducation);

// Tech Stack routes
router.get('/tech-stack', getTechStack);
router.post('/tech-stack', authenticateToken, createTechStack);
router.put('/tech-stack/:id', authenticateToken, updateTechStack);
router.delete('/tech-stack/:id', authenticateToken, deleteTechStack);

export { router as aboutRouter };