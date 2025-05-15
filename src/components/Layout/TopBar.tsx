import React from 'react';
import { Menu, Bell, UserCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface TopBarProps {
  onMenuClick: () => void;
}

const getTitleFromPath = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Dashboard';
    case '/expenses':
      return 'Expenses';
    case '/budgets':
      return 'Budgets';
    case '/reports':
      return 'Reports';
    case '/settings':
      return 'Settings';
    default:
      return 'FinTrack';
  }
};

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);

  return (
    <header className="z-10 py-4 px-4 sm:px-6 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-2 md:ml-0 text-xl font-semibold text-gray-800 dark:text-white">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none">
            <Bell size={20} />
          </button>
          <button className="flex items-center space-x-2 p-1 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 focus:outline-none">
            <UserCircle size={28} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;