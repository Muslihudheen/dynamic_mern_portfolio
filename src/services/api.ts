import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  const token = authStorage ? JSON.parse(authStorage)?.state?.token : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export const locationAPI = {
  get: async () => {
    try {
      const response = await api.get('/location');
      return response.data;
    } catch (error) {
      console.error('Error fetching location:', error);
      throw error;
    }
  },
  
  update: async (data: { city: string; officeHours: string }) => {
    try {
      const response = await api.put('/location', data);
      return response.data;
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  },
};

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const projectsAPI = {
  getAll: async (params?: { page?: number; search?: string; category?: string }) => {
    try {
      const response = await api.get('/projects', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  getById: async (id: string | number) => {
    if (!id) throw new Error('Project ID is required');
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },
  
  create: async (data: any) => {
    try {
      const formattedData = {
        ...data,
        categoryId: Number(data.categoryId),
        skills: Array.isArray(data.skills) ? data.skills : [],
        description: data.description || '',
      };
      
      const response = await api.post('/projects', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  update: async (id: number, data: any) => {
    try {
      const formattedData = {
        ...data,
        categoryId: Number(data.categoryId),
        skills: Array.isArray(data.skills) ? data.skills : [],
        description: data.description || '',
      };
      
      const response = await api.put(`/projects/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },
  
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },
};

export const skillsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/skills');
      return response.data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },
  
  create: async (data: { name: string }) => {
    try {
      const response = await api.post('/skills', data);
      return response.data;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  },
};

export const categoryAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  create: async (data: { name: string }) => {
    try {
      const response = await api.post('/categories', data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },
  
  update: async (id: number, data: { name: string }) => {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },
  
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};

export const aboutAPI = {
  get: async () => {
    const response = await api.get('/about');
    return response.data;
  },
  
  update: async (data: any) => {
    const response = await api.put('/about', data);
    return response.data;
  },

  getExperiences: async () => {
    const response = await api.get('/about/experiences');
    return response.data;
  },

  createExperience: async (data: any) => {
    const response = await api.post('/about/experiences', data);
    return response.data;
  },

  updateExperience: async (id: number, data: any) => {
    const response = await api.put(`/about/experiences/${id}`, data);
    return response.data;
  },

  deleteExperience: async (id: number) => {
    await api.delete(`/about/experiences/${id}`);
  },

  getEducation: async () => {
    const response = await api.get('/about/education');
    return response.data;
  },

  createEducation: async (data: any) => {
    const response = await api.post('/about/education', data);
    return response.data;
  },

  updateEducation: async (id: number, data: any) => {
    const response = await api.put(`/about/education/${id}`, data);
    return response.data;
  },

  deleteEducation: async (id: number) => {
    await api.delete(`/about/education/${id}`);
  },

  getTechStack: async () => {
    const response = await api.get('/about/tech-stack');
    return response.data;
  },

  createTechStack: async (data: any) => {
    const response = await api.post('/about/tech-stack', data);
    return response.data;
  },

  updateTechStack: async (id: number, data: any) => {
    const response = await api.put(`/about/tech-stack/${id}`, data);
    return response.data;
  },

  deleteTechStack: async (id: number) => {
    await api.delete(`/about/tech-stack/${id}`);
  },
};

export default api;