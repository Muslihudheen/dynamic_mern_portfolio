import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { projectsAPI } from '../services/api';
import ProjectCard from './ProjectCard';
import { useProjectStore } from '../store/projectStore';
import type { Project } from '../utils/types';

const ProjectGrid = () => {
  const activeCategory = useProjectStore((state) => state.activeCategory);
  
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects', activeCategory],
    queryFn: () => projectsAPI.getAll({ 
      category: activeCategory === 'All' ? undefined : activeCategory 
    }),
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 py-8">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="animate-pulse bg-dark-lighter rounded-2xl aspect-[16/10]"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 py-8"
    >
      {projectsData?.projects.map((project: Project) => (
        <ProjectCard 
          key={project.id}
          id={project.id}
          title={project.title}
          logo={project.logo}
          image={project.image}
          category={project.category.name}
        />
      ))}
    </motion.div>
  );
};

export default ProjectGrid;