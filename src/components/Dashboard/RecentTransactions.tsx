import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../UI/Card';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';
import { format } from 'date-fns';

const RecentTransactions: React.FC = () => {
  const { transactions } = useExpense();
  
  // Sort transactions by date (newest first) and take the 5 most recent
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <a href="/expenses" className="text-sm text-primary hover:text-primary-dark transition-colors duration-200">
          View All
        </a>
      </div>
      
      <div className="space-y-4">
        {recentTransactions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No transactions yet</p>
        ) : (
          recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600 dark:bg-green-800/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-600 dark:bg-red-800/30 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.category} • {format(new Date(transaction.date), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <p className={`font-semibold ${
                transaction.type === 'income' ? 'text-success' : 'text-error'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentTransactions;