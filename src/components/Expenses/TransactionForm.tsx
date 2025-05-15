import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import Button from '../UI/Button';
import { formatISO } from 'date-fns';
import toast from 'react-hot-toast';

interface TransactionFormProps {
  onSubmit?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const { categories, addTransaction } = useExpense();
  
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  
  const filteredCategories = categories.filter(c => c.type === type);
  
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
    
    if (!description) {
      toast.error('Please enter a description');
      return;
    }
    
    // Add new transaction
    addTransaction({
      type,
      amount: Number(amount),
      category,
      description,
      date: formatISO(new Date(date)),
    });
    
    // Reset form
    setAmount('');
    setDescription('');
    
    // Notify success
    toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully`);
    
    // Call onSubmit callback if provided
    if (onSubmit) onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex mb-4">
        <div className="flex rounded-md w-full">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md focus:outline-none ${
              type === 'expense'
                ? 'bg-error text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md focus:outline-none ${
              type === 'income'
                ? 'bg-success text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Income
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="label">Amount</label>
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
          <label htmlFor="date" className="label">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
            required
          />
        </div>
      </div>
      
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
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="description" className="label">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
          placeholder="What was this for?"
          required
        />
      </div>
      
      <Button type="submit" fullWidth icon={<Plus size={18} />}>
        Add {type === 'expense' ? 'Expense' : 'Income'}
      </Button>
    </form>
  );
};

export default TransactionForm;