import React, { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import Button from '../UI/Button';
import toast from 'react-hot-toast';
import { PiggyBank } from 'lucide-react';

interface BudgetFormProps {
  onSubmit?: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit }) => {
  const { categories, addBudget } = useExpense();
  
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  
  // Get only expense categories
  const expenseCategories = categories.filter(c => c.type === 'expense');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    
    // Find the category to get its color
    const selectedCategory = categories.find(c => c.name === category);
    const color = selectedCategory?.color || '#0D9488';
    
    // Add new budget
    addBudget({
      category,
      amount: Number(amount),
      period,
      color,
    });
    
    // Reset form
    setAmount('');
    setCategory('');
    
    // Notify success
    toast.success('Budget added successfully');
    
    // Call onSubmit callback if provided
    if (onSubmit) onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className="label">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
          required
        >
          <option value="">Select a category</option>
          {expenseCategories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="amount" className="label">Budget Amount</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">$</span>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            className="input pl-7"
            placeholder="0.00"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="label">Budget Period</label>
        <div className="flex rounded-md w-full border border-gray-300 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setPeriod('weekly')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md focus:outline-none ${
              period === 'weekly'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setPeriod('monthly')}
            className={`flex-1 py-2 px-4 text-sm font-medium focus:outline-none ${
              period === 'monthly'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setPeriod('yearly')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md focus:outline-none ${
              period === 'yearly'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
      
      <Button type="submit" fullWidth icon={<PiggyBank size={18} />}>
        Create Budget
      </Button>
    </form>
  );
};

export default BudgetForm;