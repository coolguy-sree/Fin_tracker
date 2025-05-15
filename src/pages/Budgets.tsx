import React, { useState } from 'react';
import Card from '../components/UI/Card';
import BudgetForm from '../components/Budgets/BudgetForm';
import BudgetCard from '../components/Budgets/BudgetCard';
import { Plus, X } from 'lucide-react';
import Button from '../components/UI/Button';
import { useExpense } from '../context/ExpenseContext';

const Budgets: React.FC = () => {
  const { budgets, transactions, deleteBudget } = useExpense();
  const [showForm, setShowForm] = useState(false);
  
  // Calculate spending for each budget
  const budgetsWithSpending = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percentage = Math.min(Math.round((spent / budget.amount) * 100), 100);
    
    return { ...budget, spent, percentage };
  });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h1>
        <Button 
          icon={showForm ? <X size={18} /> : <Plus size={18} />} 
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'outline' : 'primary'}
        >
          {showForm ? 'Cancel' : 'New Budget'}
        </Button>
      </div>
      
      {showForm && (
        <Card className="animate-slide-in-up">
          <h2 className="text-xl font-semibold mb-4">Create New Budget</h2>
          <BudgetForm onSubmit={() => setShowForm(false)} />
        </Card>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetsWithSpending.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No budgets created yet</p>
            <Button 
              onClick={() => setShowForm(true)}
              icon={<Plus size={18} />}
            >
              Create your first budget
            </Button>
          </div>
        ) : (
          budgetsWithSpending.map(budget => (
            <BudgetCard 
              key={budget.id} 
              budget={budget} 
              onDelete={deleteBudget} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Budgets;