import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  id: number;
  title: string;
  logo: string;
  image: string;
  category: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, logo, image, category }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={item}>
      <Link 
        to={`/project/${id}`} 
        className="group relative block overflow-hidden rounded-2xl bg-dark-lighter"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-[1] transition-opacity group-hover:opacity-90"></div>
        
        <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-white text-dark rounded-full flex items-center justify-center text-xl font-bold shadow-xl ring-1 ring-white/20 group-hover:ring-accent/50 transition-all">
            {logo}
          </div>
          <div className="flex flex-col">
            <span className="text-white text-2xl font-medium tracking-wide group-hover:text-accent transition-colors">
              {title}
            </span>
            <span className="text-sm text-gray-200/80">{category}</span>
          </div>
        </div>

        <div className="absolute top-6 right-6 z-10 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <div className="w-10 h-10 bg-accent text-dark rounded-full flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;