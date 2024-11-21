import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  logo: z.string().min(1, "Logo is required"),
  image: z.string().min(1, "Image is required"),
  categoryId: z.number().int().positive("Category is required"),
  skills: z.array(z.number()).optional(),
});

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: String(search) } },
            { description: { contains: String(search) } },
          ],
        } : {},
        category ? {
          category: { name: String(category) }
        } : {},
      ],
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          category: true,
          skills: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.project.count({ where }),
    ]);

    res.json({
      projects,
      pagination: {
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error('Error in getProjects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        category: true,
        skills: true,
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error in getProjectById:', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const data = projectSchema.parse(req.body);
    
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        logo: data.logo,
        image: data.image,
        categoryId: data.categoryId,
        skills: {
          connect: data.skills?.map(id => ({ id })) || [],
        },
      },
      include: {
        category: true,
        skills: true,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error in createProject:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid project data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to create project' });
    }
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const data = projectSchema.parse(req.body);

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: data.title,
        description: data.description,
        logo: data.logo,
        image: data.image,
        categoryId: data.categoryId,
        skills: {
          set: [],
          connect: data.skills?.map(id => ({ id })) || [],
        },
      },
      include: {
        category: true,
        skills: true,
      },
    });

    res.json(project);
  } catch (error) {
    console.error('Error in updateProject:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid project data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to update project' });
    }
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
};