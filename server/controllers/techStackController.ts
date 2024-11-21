import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const techStackSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  icon: z.string().min(1, 'Icon is required'),
  category: z.string().min(1, 'Category is required'),
  proficiency: z.union([
    z.number().min(0).max(100),
    z.string().transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) throw new Error('Invalid proficiency value');
      return num;
    })
  ]),
});

export const getTechStack = async (req: Request, res: Response) => {
  try {
    const techStack = await prisma.techStack.findMany({
      orderBy: [
        { category: 'asc' },
        { proficiency: 'desc' },
      ],
    });
    res.json(techStack);
  } catch (error) {
    console.error('Error in getTechStack:', error);
    res.status(500).json({ message: 'Failed to fetch tech stack' });
  }
};

export const createTechStack = async (req: Request, res: Response) => {
  try {
    const validatedData = techStackSchema.parse(req.body);
    const techStack = await prisma.techStack.create({
      data: {
        name: validatedData.name,
        icon: validatedData.icon,
        category: validatedData.category,
        proficiency: Number(validatedData.proficiency),
      },
    });
    res.status(201).json(techStack);
  } catch (error) {
    console.error('Error in createTechStack:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid tech stack data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to create tech stack' });
    }
  }
};

export const updateTechStack = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = techStackSchema.parse(req.body);
    
    const techStack = await prisma.techStack.update({
      where: { id: parseInt(id) },
      data: {
        name: validatedData.name,
        icon: validatedData.icon,
        category: validatedData.category,
        proficiency: Number(validatedData.proficiency),
      },
    });
    
    res.json(techStack);
  } catch (error) {
    console.error('Error in updateTechStack:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid tech stack data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to update tech stack' });
    }
  }
};

export const deleteTechStack = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.techStack.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteTechStack:', error);
    res.status(500).json({ message: 'Failed to delete tech stack' });
  }
};