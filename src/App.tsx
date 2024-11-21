import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Portfolio from './pages/Portfolio';
import ProjectDetails from './pages/ProjectDetails';
import About from './pages/About';
import AdminApp from './admin/AdminApp';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;