import React from 'react';
import BalanceCard from '../components/Dashboard/BalanceCard';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import BudgetProgress from '../components/Dashboard/BudgetProgress';
import ExpenseChart from '../components/Dashboard/ExpenseChart';
import { Plus } from 'lucide-react';
import Button from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Button 
          icon={<Plus size={18} />} 
          onClick={() => navigate('/expenses')}
        >
          New Transaction
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BalanceCard />
        <div className="md:col-span-2">
          <ExpenseChart />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentTransactions />
        <BudgetProgress />
      </div>
    </div>
  );
};

export default Dashboard;