import React, { useState } from 'react';
import Card from '../components/UI/Card';
import TransactionForm from '../components/Expenses/TransactionForm';
import TransactionList from '../components/Expenses/TransactionList';
import { Plus, X } from 'lucide-react';
import Button from '../components/UI/Button';

const Expenses: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
        <Button 
          icon={showForm ? <X size={18} /> : <Plus size={18} />} 
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'outline' : 'primary'}
        >
          {showForm ? 'Cancel' : 'New Transaction'}
        </Button>
      </div>
      
      {showForm && (
        <Card className="animate-slide-in-up">
          <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
          <TransactionForm onSubmit={() => setShowForm(false)} />
        </Card>
      )}
      
      <TransactionList />
    </div>
  );
};

export default Expenses;