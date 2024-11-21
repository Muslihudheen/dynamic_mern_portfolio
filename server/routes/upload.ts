import { Router } from 'express';
import { upload } from '../services/uploadService';
import { authenticateToken } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = Router();

// Regular image upload route
router.post('/', authenticateToken, upload.single('image'), (req: AuthRequest, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// Resume upload route
router.post('/resume', authenticateToken, upload.single('resume'), (req: AuthRequest, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const resumeUrl = `/uploads/${req.file.filename}`;
  res.json({ url: resumeUrl });
});

export { router as uploadRouter };