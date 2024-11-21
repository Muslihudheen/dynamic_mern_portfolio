import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const experienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
  current: z.boolean().default(false),
  description: z.string().min(1),
});

export const getExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    });
    res.json(experiences);
  } catch (error) {
    console.error('Error in getExperiences:', error);
    res.status(500).json({ message: 'Failed to fetch experiences' });
  }
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    const data = experienceSchema.parse(req.body);
    const experience = await prisma.experience.create({ data });
    res.status(201).json(experience);
  } catch (error) {
    console.error('Error in createExperience:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid experience data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to create experience' });
    }
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = experienceSchema.parse(req.body);
    
    const experience = await prisma.experience.update({
      where: { id: parseInt(id) },
      data,
    });
    
    res.json(experience);
  } catch (error) {
    console.error('Error in updateExperience:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid experience data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to update experience' });
    }
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.experience.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteExperience:', error);
    res.status(500).json({ message: 'Failed to delete experience' });
  }
};