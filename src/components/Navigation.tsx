import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProjectStore } from '../store/projectStore';
import { categoryAPI } from '../services/api';
import type { Category } from '../utils/types';

const Navigation = () => {
  const { activeCategory, setActiveCategory } = useProjectStore();
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoryAPI.getAll,
  });

  return (
    <nav className="border-t border-white/10 pt-6">
      <div className="overflow-x-auto scrollbar-thin">
        <ul className="flex gap-8 min-w-max pb-2 px-1">
          <li>
            <button
              onClick={() => setActiveCategory('All')}
              className={`text-lg transition-all relative ${
                activeCategory === 'All' 
                  ? 'text-accent font-medium' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
              {activeCategory === 'All' && (
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-accent rounded-full" />
              )}
            </button>
          </li>
          {categories?.map((category: Category) => (
            <li key={category.id}>
              <button
                onClick={() => setActiveCategory(category.name)}
                className={`text-lg transition-all relative ${
                  activeCategory === category.name 
                    ? 'text-accent font-medium' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {category.name}
                {activeCategory === category.name && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-accent rounded-full" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;