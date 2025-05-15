import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from '../UI/Card';
import { useExpense } from '../../context/ExpenseContext';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/formatters';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface CategoryChartProps {
  type: 'expense' | 'income';
}

const CategoryChart: React.FC<CategoryChartProps> = ({ type }) => {
  const { transactions, categories } = useExpense();
  const { isDarkMode } = useTheme();
  
  // Filter transactions by type
  const filteredTransactions = transactions.filter(t => t.type === type);
  
  // Calculate totals by category
  const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Prepare data for chart
  const categoryNames = Object.keys(categoryTotals);
  const categoryValues = Object.values(categoryTotals);
  
  // Get colors from categories
  const categoryColors = categoryNames.map(name => {
    const category = categories.find(c => c.name === name);
    return category?.color || '#0D9488';
  });
  
  const data = {
    labels: categoryNames,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryColors,
        borderColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
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
  
  const total = categoryValues.reduce((a, b) => a + b, 0);
  
  return (
    <Card className="h-full">
      <h3 className="text-lg font-semibold mb-2">
        {type === 'expense' ? 'Expenses' : 'Income'} by Category
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Total: {formatCurrency(total)}
      </p>
      {categoryNames.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">No {type} data available</p>
        </div>
      ) : (
        <div className="h-64">
          <Doughnut data={data} options={options} />
        </div>
      )}
    </Card>
  );
};

export default CategoryChart;