import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PiggyBank, 
  LineChart, 
  Settings,
  X 
} from 'lucide-react';
import ThemeToggle from '../UI/ThemeToggle';

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors
        ${isActive 
          ? 'text-primary bg-primary/10 dark:bg-primary/20' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
    >
      <span className="mr-3 h-6 w-6">{icon}</span>
      {label}
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ mobile = false, onClose }) => {
  return (
    <div className={`flex flex-col h-full ${mobile ? 'w-full' : 'w-72'} bg-white dark:bg-gray-800 shadow-lg`}>
      {mobile && (
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
      )}
      
      <div className="flex items-center justify-center py-6">
        <div className="flex items-center space-x-2">
          <PiggyBank size={32} className="text-primary" />
          <h1 className="text-xl font-bold">FinTrack</h1>
        </div>
      </div>
      
      <div className="flex-1 px-2 space-y-1">
        <NavItem to="/" icon={<LayoutDashboard />} label="Dashboard" />
        <NavItem to="/expenses" icon={<Receipt />} label="Expenses" />
        <NavItem to="/budgets" icon={<PiggyBank />} label="Budgets" />
        <NavItem to="/reports" icon={<LineChart />} label="Reports" />
        <NavItem to="/settings" icon={<Settings />} label="Settings" />
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;