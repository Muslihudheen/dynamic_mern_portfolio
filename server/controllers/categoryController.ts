import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1),
});

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { projects: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = categorySchema.parse(req.body);
    
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await prisma.category.create({
      data: { name }
    });

    res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid category data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to create category' });
    }
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = categorySchema.parse(req.body);

    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });

    if (existingCategory && existingCategory.id !== parseInt(id)) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name }
    });

    res.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid category data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to update category' });
    }
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const projectCount = await prisma.project.count({
      where: { categoryId: parseInt(id) }
    });

    if (projectCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with existing projects' 
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category' });
  }
};