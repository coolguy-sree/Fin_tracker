
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { formatISO } from 'date-fns';
import { useUser } from './UserContext';

// Define types for our data
export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  color: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
  icon?: string;
}

interface ExpenseContextType {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

// Create the context
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Sample default data
const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', type: 'expense', color: '#0D9488' },
  { id: 'cat-2', name: 'Transportation', type: 'expense', color: '#4F46E5' },
  { id: 'cat-3', name: 'Housing', type: 'expense', color: '#059669' },
  { id: 'cat-4', name: 'Entertainment', type: 'expense', color: '#B45309' },
  { id: 'cat-5', name: 'Utilities', type: 'expense', color: '#BE185D' },
  { id: 'cat-6', name: 'Salary', type: 'income', color: '#047857' },
  { id: 'cat-7', name: 'Investments', type: 'income', color: '#1D4ED8' },
  { id: 'cat-8', name: 'Gifts', type: 'income', color: '#7C3AED' },
];

const defaultTransactions: Transaction[] = [
  {
    id: 'txn-1',
    type: 'expense',
    amount: 45.5,
    category: 'Food & Dining',
    description: 'Grocery shopping',
    date: formatISO(new Date(Date.now() - 24 * 60 * 60 * 1000)),
  },
  {
    id: 'txn-2',
    type: 'expense',
    amount: 25,
    category: 'Transportation',
    description: 'Gas',
    date: formatISO(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
  },
  {
    id: 'txn-3',
    type: 'income',
    amount: 2500,
    category: 'Salary',
    description: 'Monthly salary',
    date: formatISO(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
  },
];

const defaultBudgets: Budget[] = [
  { id: 'budget-1', category: 'Food & Dining', amount: 500, period: 'monthly', color: '#0D9488' },
  { id: 'budget-2', category: 'Transportation', amount: 200, period: 'monthly', color: '#4F46E5' },
  { id: 'budget-3', category: 'Entertainment', amount: 150, period: 'monthly', color: '#B45309' },
];

// Provider component
export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();

  // Helper to get user-specific localStorage key
  const getKey = (key: string) => {
    return user ? `${user}-${key}` : key;
  };

  // Setup state using localStorage for persistence
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (!user) return [];
    const savedTransactions = localStorage.getItem(getKey('transactions'));
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    if (!user) return [];
    const savedBudgets = localStorage.getItem(getKey('budgets'));
    return savedBudgets ? JSON.parse(savedBudgets) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    if (!user) return defaultCategories;
    const savedCategories = localStorage.getItem(getKey('categories'));
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(getKey('transactions'), JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(getKey('budgets'), JSON.stringify(budgets));
    }
  }, [budgets, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(getKey('categories'), JSON.stringify(categories));
    }
  }, [categories, user]);

  // Reset state when user changes
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setBudgets([]);
      setCategories(defaultCategories);
    } else {
      const savedTransactions = localStorage.getItem(getKey('transactions'));
      setTransactions(savedTransactions ? JSON.parse(savedTransactions) : []);
      const savedBudgets = localStorage.getItem(getKey('budgets'));
      setBudgets(savedBudgets ? JSON.parse(savedBudgets) : []);
      const savedCategories = localStorage.getItem(getKey('categories'));
      setCategories(savedCategories ? JSON.parse(savedCategories) : defaultCategories);
    }
  }, [user]);

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
    };
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(transaction =>
        transaction.id === id ? { ...transaction, ...updatedFields } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prevTransactions =>
      prevTransactions.filter(transaction => transaction.id !== id)
    );
  };

  // Budget functions
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = {
      ...budget,
      id: `budget-${Date.now()}`,
    };
    setBudgets(prevBudgets => [...prevBudgets, newBudget]);
  };

  const updateBudget = (id: string, updatedFields: Partial<Budget>) => {
    setBudgets(prevBudgets =>
      prevBudgets.map(budget =>
        budget.id === id ? { ...budget, ...updatedFields } : budget
      )
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets(prevBudgets =>
      prevBudgets.filter(budget => budget.id !== id)
    );
  };

  // Category functions
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    setCategories(prevCategories => [...prevCategories, newCategory]);
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === id ? { ...category, ...updatedFields } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prevCategories =>
      prevCategories.filter(category => category.id !== id)
    );
  };

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        budgets,
        categories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook for using the context
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
