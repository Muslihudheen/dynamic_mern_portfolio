import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const skillSchema = z.object({
  name: z.string().min(1),
});

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch skills' });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name } = skillSchema.parse(req.body);
    
    const existingSkill = await prisma.skill.findUnique({
      where: { name }
    });

    if (existingSkill) {
      return res.status(400).json({ message: 'Skill already exists' });
    }

    const skill = await prisma.skill.create({
      data: { name }
    });

    res.status(201).json(skill);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid skill data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to create skill' });
    }
  }
};