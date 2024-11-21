import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { projectsAPI } from '../services/api';
import { Skill } from '../utils/types';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsAPI.getById(id || ''),
    enabled: !!id,
    onError: () => {
      navigate('/');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark text-white font-kanit flex items-center justify-center">
        <div className="animate-pulse">Loading project details...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-dark text-white font-kanit flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Project not found</p>
          <Link 
            to="/" 
            className="text-accent hover:text-accent/80 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white font-kanit">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-fade-in">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-dark-lighter">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white text-dark rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                {project.logo}
              </div>
              <div>
                <h1 className="text-3xl font-medium tracking-wide">{project.title}</h1>
                <span className="text-gray-400">{project.category.name}</span>
              </div>
            </div>
          </div>

          <div className="animate-slide-up">
            {project.description && (
              <div 
                className="prose prose-invert max-w-none mb-8"
                dangerouslySetInnerHTML={{ 
                  __html: project.description 
                }} 
              />
            )}

            {project.skills?.length > 0 && (
              <div>
                <h2 className="text-xl font-medium mb-4">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill: Skill) => (
                    <span 
                      key={skill.id}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;