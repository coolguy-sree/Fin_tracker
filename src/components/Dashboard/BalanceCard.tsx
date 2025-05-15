import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../UI/Card';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';

const BalanceCard: React.FC = () => {
  const { transactions } = useExpense();
  
  // Calculate total income, expenses, and balance
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = income - expenses;
  
  // Determine if balance is positive or negative
  const isPositive = balance >= 0;
  
  return (
    <Card className="border-l-4 border-primary">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Balance</h3>
          <p className="text-2xl font-bold mt-1">{formatCurrency(balance)}</p>
        </div>
        <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'}`}>
          {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Income</p>
          <p className="text-lg font-semibold text-success">{formatCurrency(income)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Expenses</p>
          <p className="text-lg font-semibold text-error">{formatCurrency(expenses)}</p>
        </div>
      </div>
    </Card>
  );
};

export default BalanceCard;