import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const locationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  officeHours: z.string().min(1, 'Office hours are required'),
});

export const getLocation = async (req: Request, res: Response) => {
  try {
    const location = await prisma.location.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    console.error('Error in getLocation:', error);
    res.status(500).json({ message: 'Failed to fetch location' });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const data = locationSchema.parse(req.body);
    
    const location = await prisma.location.upsert({
      where: { id: 1 },
      update: {
        city: data.city,
        officeHours: data.officeHours,
      },
      create: {
        city: data.city,
        officeHours: data.officeHours,
      },
    });

    res.json(location);
  } catch (error) {
    console.error('Error in updateLocation:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: 'Invalid location data', 
        errors: error.errors 
      });
    } else {
      res.status(500).json({ message: 'Failed to update location' });
    }
  }
};