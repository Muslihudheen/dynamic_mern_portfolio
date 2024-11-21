import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
  current: z.boolean().default(false),
  description: z.string().optional(),
}).refine(data => {
  if (!data.current && !data.endDate) {
    return false;
  }
  return true;
}, {
  message: "End date is required when not current",
  path: ["endDate"],
});

export const getEducation = async (req: Request, res: Response) => {
  try {
    const education = await prisma.education.findMany({
      orderBy: { startDate: 'desc' },
    });
    res.json(education);
  } catch (error) {
    console.error('Error in getEducation:', error);
    res.status(500).json({ message: 'Failed to fetch education' });
  }
};

export const createEducation = async (req: Request, res: Response) => {
  try {
    const data = educationSchema.parse(req.body);
    const education = await prisma.education.create({ data });
    res.status(201).json(education);
  } catch (error) {
    console.error('Error in createEducation:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid education data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to create education' });
    }
  }
};

export const updateEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = educationSchema.parse(req.body);
    
    const education = await prisma.education.update({
      where: { id: parseInt(id) },
      data,
    });
    
    res.json(education);
  } catch (error) {
    console.error('Error in updateEducation:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid education data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to update education' });
    }
  }
};

export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.education.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteEducation:', error);
    res.status(500).json({ message: 'Failed to delete education' });
  }
};