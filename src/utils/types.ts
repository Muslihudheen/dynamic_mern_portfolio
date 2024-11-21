export interface Category {
  id: number;
  name: string;
  _count?: {
    projects: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  logo: string;
  image: string;
  skills: Skill[];
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  description?: string;
  logo: string;
  image: string;
  categoryId: number;
  skills: number[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}