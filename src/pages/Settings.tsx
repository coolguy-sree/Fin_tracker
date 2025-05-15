import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useExpense } from '../context/ExpenseContext';
import { useTheme } from '../hooks/useTheme';
import { Download, Upload, Sun, Moon, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { transactions, budgets, categories } = useExpense();
  const { isDarkMode, setTheme } = useTheme();
  const [newCategory, setNewCategory] = useState('');
  const [categoryType, setCategoryType] = useState<'expense' | 'income'>('expense');
  
  const handleExportData = () => {
    const data = {
      transactions,
      budgets,
      categories,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintrack-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };
  
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        if (!data.transactions || !data.budgets || !data.categories) {
          throw new Error('Invalid file format');
        }
        
        // Save the imported data to localStorage
        localStorage.setItem('transactions', JSON.stringify(data.transactions));
        localStorage.setItem('budgets', JSON.stringify(data.budgets));
        localStorage.setItem('categories', JSON.stringify(data.categories));
        
        toast.success('Data imported successfully. Please refresh the page.');
      } catch (err) {
        toast.error('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('transactions');
      localStorage.removeItem('budgets');
      localStorage.removeItem('categories');
      
      toast.success('All data cleared. Please refresh the page.');
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      
      <Card>
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <p className="font-medium">Theme Mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Choose between light and dark mode</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setTheme('light')}
              variant={isDarkMode ? 'outline' : 'primary'}
              size="sm"
              icon={<Sun size={16} />}
            >
              Light
            </Button>
            <Button
              onClick={() => setTheme('dark')}
              variant={isDarkMode ? 'primary' : 'outline'}
              size="sm"
              icon={<Moon size={16} />}
            >
              Dark
            </Button>
          </div>
        </div>
      </Card>
      
      <Card>
        <h2 className="text-lg font-semibold mb-4">Data Management</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Download all your financial data</p>
            </div>
            <Button onClick={handleExportData} variant="outline" size="sm" icon={<Download size={16} />}>
              Export
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium">Import Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload your previously exported data</p>
            </div>
            <div>
              <input
                type="file"
                id="file-import"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
              <Button variant="outline" size="sm" icon={<Upload size={16} />} onClick={() => document.getElementById('file-import')?.click()}>
                Import
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium">Clear All Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete all your data</p>
            </div>
            <Button onClick={handleClearData} variant="danger" size="sm" icon={<Trash2 size={16} />}>
              Clear Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;