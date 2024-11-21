import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const aboutSchema = z.object({
  biography: z.string().min(1, 'Biography is required'),
  resumeUrl: z.string().min(1).nullable().optional(), // Remove URL validation for local uploads
});

export const getAbout = async (req: Request, res: Response) => {
  try {
    const about = await prisma.about.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    
    if (!about) {
      // Create default about if none exists
      const defaultAbout = await prisma.about.create({
        data: {
          biography: '',
          resumeUrl: null,
        },
      });
      return res.json(defaultAbout);
    }

    res.json(about);
  } catch (error) {
    console.error('Error in getAbout:', error);
    res.status(500).json({ message: 'Failed to fetch about information' });
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  try {
    const data = aboutSchema.parse(req.body);
    
    const about = await prisma.about.upsert({
      where: { id: 1 },
      update: data,
      create: data,
    });

    res.json(about);
  } catch (error) {
    console.error('Error in updateAbout:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to update about information' });
    }
  }
};