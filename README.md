# Modern Portfolio Website

A dynamic portfolio website with an admin panel built using React, Node.js, and SQLite.

## Features

- 🎨 Beautiful, responsive design
- 🔐 Secure admin panel
- 📁 Project management
- 📍 Location management
- 🖼️ Image upload support
- 🔄 Dynamic content
- 🎯 Category management

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Install dependencies:
   ```bash
   npm install
   ```
4. Initialize the database:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```
5. Start the development server:
   ```bash
   npm run server:dev
   npm run dev
   ```

## Admin Access

Default admin credentials:
- Email: admin@example.com
- Password: admin123

## Project Structure

```
├── prisma/          # Database schema and migrations
├── public/          # Static assets
├── server/          # Backend API
├── src/
│   ├── admin/       # Admin panel components
│   ├── components/  # Shared components
│   ├── pages/       # Page components
│   ├── services/    # API services
│   ├── store/       # State management
│   └── utils/       # Utility functions
└── uploads/         # Uploaded files
```

## API Documentation

### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register new admin (protected)

### Projects
- GET `/api/projects` - List projects
- POST `/api/projects` - Create project
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

### Categories
- GET `/api/categories` - List categories
- POST `/api/categories` - Create category
- PUT `/api/categories/:id` - Update category
- DELETE `/api/categories/:id` - Delete category

### Location
- GET `/api/location` - Get current location
- PUT `/api/location` - Update location

### Upload
- POST `/api/upload` - Upload image

## Security

- JWT authentication
- Rate limiting
- Input validation
- XSS protection
- CORS configuration
