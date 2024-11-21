import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aboutAPI } from '../services/api';

const About = () => {
  const { data: about } = useQuery({
    queryKey: ['about'],
    queryFn: aboutAPI.get,
  });

  const { data: experiences } = useQuery({
    queryKey: ['experiences'],
    queryFn: aboutAPI.getExperiences,
  });

  const { data: education } = useQuery({
    queryKey: ['education'],
    queryFn: aboutAPI.getEducation,
  });

  const { data: techStack } = useQuery({
    queryKey: ['tech-stack'],
    queryFn: aboutAPI.getTechStack,
  });

  const techCategories = techStack?.reduce((acc: any, tech: any) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-dark text-white font-kanit">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,255,0,0.1),_transparent_50%)]"></div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Portfolio
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-16"
          >
            {/* Biography */}
            <section>
              <h1 className="text-4xl font-light mb-8">About Me</h1>
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: about?.biography || '' }} />
              </div>
              {about?.resumeUrl && (
                <a
                  href={about.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 mt-6 bg-accent text-dark px-6 py-3 rounded-full hover:bg-accent/90 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Resume
                </a>
              )}
            </section>

            {/* Tech Stack */}
            <section>
              <h2 className="text-3xl font-light mb-8">Technical Skills</h2>
              <div className="space-y-8">
                {Object.entries(techCategories || {}).map(([category, techs]: [string, any]) => (
                  <div key={category}>
                    <h3 className="text-xl font-medium mb-4">{category}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {techs.map((tech: any) => (
                        <div
                          key={tech.id}
                          className="bg-dark-lighter p-4 rounded-lg flex flex-col items-center gap-2"
                        >
                          <img src={tech.icon} alt={tech.name} className="w-12 h-12" />
                          <span className="text-sm">{tech.name}</span>
                          <div className="w-full bg-dark rounded-full h-1.5">
                            <div
                              className="bg-accent h-1.5 rounded-full"
                              style={{ width: `${tech.proficiency}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-3xl font-light mb-8">Work Experience</h2>
              <div className="space-y-8">
                {experiences?.map((exp: any) => (
                  <div key={exp.id} className="relative pl-8 pb-8 border-l border-white/10">
                    <div className="absolute left-0 top-0 w-4 h-4 -translate-x-2 rounded-full bg-accent" />
                    <h3 className="text-xl font-medium">{exp.title}</h3>
                    <p className="text-gray-400">{exp.company}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(exp.startDate).toLocaleDateString()} -{' '}
                      {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-300">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-3xl font-light mb-8">Education</h2>
              <div className="space-y-8">
                {education?.map((edu: any) => (
                  <div key={edu.id} className="relative pl-8 pb-8 border-l border-white/10">
                    <div className="absolute left-0 top-0 w-4 h-4 -translate-x-2 rounded-full bg-accent" />
                    <h3 className="text-xl font-medium">{edu.degree}</h3>
                    <p className="text-gray-400">{edu.institution}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(edu.startDate).toLocaleDateString()} -{' '}
                      {edu.current ? 'Present' : new Date(edu.endDate).toLocaleDateString()}
                    </p>
                    {edu.description && (
                      <p className="text-gray-300">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;