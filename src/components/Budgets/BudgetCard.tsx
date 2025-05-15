import React from 'react';
import { Trash2 } from 'lucide-react';
import Card from '../UI/Card';
import { Budget } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface BudgetCardProps {
  budget: Budget & { spent: number; percentage: number };
  onDelete: (id: string) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      onDelete(budget.id);
      toast.success('Budget deleted successfully');
    }
  };
  
  // Calculate remaining amount
  const remaining = budget.amount - budget.spent;
  
  return (
    <Card className="animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{budget.category}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {budget.period === 'weekly' ? 'Weekly' : budget.period === 'monthly' ? 'Monthly' : 'Yearly'} Budget
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          aria-label="Delete budget"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="mt-4 mb-2">
        <div className="flex justify-between mb-1">
          <p className="text-sm">Budget</p>
          <p className="text-sm font-medium">{formatCurrency(budget.amount)}</p>
        </div>
        <div className="flex justify-between mb-1">
          <p className="text-sm">Spent</p>
          <p className="text-sm font-medium">{formatCurrency(budget.spent)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Remaining</p>
          <p className={`text-sm font-medium ${remaining >= 0 ? 'text-success' : 'text-error'}`}>
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">{budget.percentage}% used</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
          </p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
              budget.percentage > 90 ? 'bg-error' :
              budget.percentage > 75 ? 'bg-warning' :
              'bg-primary'
            }`}
            style={{ width: `${budget.percentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default BudgetCard;