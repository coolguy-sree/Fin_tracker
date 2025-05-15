import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from '../UI/Card';
import { useExpense } from '../../context/ExpenseContext';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/formatters';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseChart: React.FC = () => {
  const { transactions } = useExpense();
  const { isDarkMode } = useTheme();
  
  // Get the last 7 days
  const today = startOfDay(new Date());
  const dates = eachDayOfInterval({
    start: subDays(today, 6),
    end: today
  });
  
  // Format dates for display
  const labels = dates.map(date => format(date, 'EEE'));
  
  // Calculate daily totals
  const expenseData = dates.map(date => {
    const dayStart = startOfDay(date);
    const nextDay = subDays(dayStart, -1);
    
    return transactions
      .filter(t => t.type === 'expense' && 
                 new Date(t.date) >= dayStart && 
                 new Date(t.date) < nextDay)
      .reduce((sum, t) => sum + t.amount, 0);
  });
  
  const incomeData = dates.map(date => {
    const dayStart = startOfDay(date);
    const nextDay = subDays(dayStart, -1);
    
    return transactions
      .filter(t => t.type === 'income' && 
                 new Date(t.date) >= dayStart && 
                 new Date(t.date) < nextDay)
      .reduce((sum, t) => sum + t.amount, 0);
  });
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#F3F4F6' : '#1F2937',
          font: {
            family: 'Inter',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#D1D5DB' : '#4B5563',
          font: {
            family: 'Inter',
          },
        },
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#D1D5DB' : '#4B5563',
          font: {
            family: 'Inter',
          },
          callback: function(value: any) {
            return formatCurrency(value);
          }
        },
      },
    },
  };
  
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Weekly Overview</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default ExpenseChart;