import React, { useState } from 'react';
import CategoryChart from '../components/Reports/CategoryChart';
import Card from '../components/UI/Card';
import { useExpense } from '../context/ExpenseContext';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../hooks/useTheme';
import { formatCurrency } from '../utils/formatters';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const Reports: React.FC = () => {
  const { transactions } = useExpense();
  const { isDarkMode } = useTheme();
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('month');
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const savingsRate = totalIncome > 0 
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) 
    : 0;
  
  // Income vs Expenses chart data
  const overviewData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.7)'],
        borderColor: ['rgb(16, 185, 129)', 'rgb(239, 68, 68)'],
        borderWidth: 1,
      },
    ],
  };
  
  const overviewOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDarkMode ? '#F3F4F6' : '#1F2937',
          font: {
            family: 'Inter',
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1.5 text-sm font-medium ${
              period === 'week'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-1.5 text-sm font-medium ${
              period === 'month'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`px-3 py-1.5 text-sm font-medium ${
              period === 'all'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            All Time
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-800/30 dark:text-green-400 mr-4">
              <ArrowUpRight size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-800/30 dark:text-red-400 mr-4">
              <ArrowDownRight size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Savings Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{savingsRate}%</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
              <div 
                className={`h-2.5 rounded-full ${savingsRate >= 20 ? 'bg-success' : 'bg-warning'}`}
                style={{ width: `${Math.max(savingsRate, 0)}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Income vs. Expenses</h3>
          <div className="h-64">
            <Pie data={overviewData} options={overviewOptions} />
          </div>
        </Card>
        
        <div className="grid grid-cols-1 gap-6">
          <CategoryChart type="expense" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <CategoryChart type="income" />
      </div>
    </div>
  );
};

export default Reports;