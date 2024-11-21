import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import ProjectGrid from '../components/ProjectGrid';
import LocationBadge from '../components/LocationBadge';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-dark text-white font-kanit">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,255,0,0.1),_transparent_50%)]"></div>
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Header />
        </motion.div>
        <LocationBadge />
        <main className="container mx-auto px-4 py-8">
          <ProjectGrid />
        </main>
      </div>
    </div>
  );
};

export default Portfolio;