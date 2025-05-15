import React from 'react';
import Card from '../UI/Card';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';

const BudgetProgress: React.FC = () => {
  const { budgets, transactions } = useExpense();
  
  // Calculate spending for each budget category
  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
  
  // Sort budgets by percentage used (highest first)
  const sortedBudgets = [...budgets]
    .map(budget => {
      const spent = categorySpending[budget.category] || 0;
      const percentage = Math.min(Math.round((spent / budget.amount) * 100), 100);
      return { ...budget, spent, percentage };
    })
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4); // Take top 4 budgets
  
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Budget Overview</h3>
        <a href="/budgets" className="text-sm text-primary hover:text-primary-dark transition-colors duration-200">
          View All
        </a>
      </div>
      
      <div className="space-y-4">
        {sortedBudgets.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No budgets set up yet</p>
        ) : (
          sortedBudgets.map((budget) => (
            <div key={budget.id} className="space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium">{budget.category}</p>
                <p className="text-sm">
                  {formatCurrency(budget.spent)} <span className="text-gray-500 dark:text-gray-400">of {formatCurrency(budget.amount)}</span>
                </p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    budget.percentage > 90 ? 'bg-error' :
                    budget.percentage > 75 ? 'bg-warning' :
                    'bg-primary'
                  }`}
                  style={{ width: `${budget.percentage}%` }}
                />
              </div>
              <p className="text-xs text-right">
                {budget.percentage}% used
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default BudgetProgress;