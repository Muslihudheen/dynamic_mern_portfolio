import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { configureSecurityMiddleware } from './middleware/security';
import { authRouter } from './routes/auth';
import { projectRouter } from './routes/projects';
import { locationRouter } from './routes/location';
import { categoryRouter } from './routes/categories';
import { skillRouter } from './routes/skills';
import { uploadRouter } from './routes/upload';
import { aboutRouter } from './routes/about';
import { authenticateToken } from './middleware/auth';

// ES Module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure security middleware
configureSecurityMiddleware(app);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/skills', skillRouter);
app.use('/api/location', locationRouter);
app.use('/api/upload', authenticateToken, uploadRouter);
app.use('/api/about', aboutRouter); // Add the about router

// Serve static files from the `dist` directory outside of `server`
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Catch-all route to serve the frontend's `index.html` for any unknown paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
