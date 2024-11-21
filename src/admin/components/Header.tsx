import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Welcome, {user?.name}</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-dark font-medium">
            {user?.name[0]}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;