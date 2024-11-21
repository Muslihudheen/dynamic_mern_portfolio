import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, MapPin, LogOut, Tags, User, Briefcase, GraduationCap, Code } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-dark text-white overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-8 text-white">Admin Panel</h1>
        <nav className="space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-accent text-dark font-medium' : 'text-gray-200 hover:bg-white/10'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/projects"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-accent text-dark font-medium' : 'text-gray-200 hover:bg-white/10'
              }`
            }
          >
            <FolderKanban className="w-5 h-5" />
            Projects
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-accent text-dark font-medium' : 'text-gray-200 hover:bg-white/10'
              }`
            }
          >
            <Tags className="w-5 h-5" />
            Categories
          </NavLink>
          <NavLink
            to="/admin/location"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-accent text-dark font-medium' : 'text-gray-200 hover:bg-white/10'
              }`
            }
          >
            <MapPin className="w-5 h-5" />
            Location
          </NavLink>

          <div className="py-2">
            <div className="text-xs uppercase text-gray-400 px-4 py-2">About Section</div>
            <div className="space-y-2">
              <NavLink
                to="/admin/about"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-accent text-dark font-medium' : 'text-gray-200 hover:bg-white/10'
                  }`
                }
              >
                <User className="w-5 h-5" />
                Biography
              </NavLink>
              <NavLink
                to="/admin/experience"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-accent text-dark font-medium' : 'text-gray-200 hover:bg-white/10'
                  }`
                }
              >
                <Briefcase className="w-5 h-5" />
                Experience
              </NavLink>
              <NavLink
                to="/admin/education"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-accent text-dark font-medium' : 'text-gray-200 hover:bg-white/10'
                  }`
                }
              >
                <GraduationCap className="w-5 h-5" />
                Education
              </NavLink>
              <NavLink
                to="/admin/tech-stack"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-accent text-dark font-medium' : 'text-gray-200 hover:bg-white/10'
                  }`
                }
              >
                <Code className="w-5 h-5" />
                Tech Stack
              </NavLink>
            </div>
          </div>
        </nav>
      </div>
      <button
        onClick={logout}
        className="absolute bottom-8 left-6 right-6 flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-white/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
};

export default Sidebar;