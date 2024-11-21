import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LayoutGrid, MapPin, Clock } from 'lucide-react';
import { projectsAPI, locationAPI } from '../../services/api';
import type { Project } from '../../utils/types';

const Dashboard = () => {
  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll(),
  });

  const { data: locationData } = useQuery({
    queryKey: ['location'],
    queryFn: locationAPI.get,
  });

  const stats = [
    {
      label: 'Total Projects',
      value: projectsData?.pagination?.total?.toString() || '0',
      icon: LayoutGrid,
      color: 'bg-blue-500',
    },
    {
      label: 'Current Location',
      value: locationData?.city || 'Not set',
      icon: MapPin,
      color: 'bg-green-500',
    },
    {
      label: 'Office Hours',
      value: locationData?.officeHours || 'Not set',
      icon: Clock,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-semibold mt-2 text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Projects</h2>
          <div className="space-y-4">
            {projectsData?.projects?.slice(0, 5).map((project: Project) => (
              <div key={project.id} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-medium text-gray-800">
                  {project.logo}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{project.title}</p>
                  <p className="text-sm text-gray-600">{project.category.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h2>
          <div className="space-y-2">
            <a
              href="/admin/projects"
              className="block w-full p-3 text-center rounded-lg border text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Manage Projects
            </a>
            <a
              href="/admin/location"
              className="block w-full p-3 text-center rounded-lg border text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Update Location
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;