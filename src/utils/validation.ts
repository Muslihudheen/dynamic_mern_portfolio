import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  logo: z.string().min(1, 'Logo is required'),
  image: z.string().url('Invalid image URL'),
  category: z.string().min(1, 'Category is required'),
});

export const locationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  officeHours: z.string().min(1, 'Office hours are required'),
});

export const getMaxDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const validateDateRange = (startDate: string, endDate?: string) => {
  if (!endDate) return true;
  return new Date(startDate) <= new Date(endDate);
};