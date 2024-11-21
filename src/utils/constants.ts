export const API_BASE_URL = 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin',
    PROJECTS: '/admin/projects',
    LOCATION: '/admin/location',
  },
} as const;