import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import type { Transaction } from './types';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleNewTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([...transactions, newTransaction]);
  };

  return (
    <div className="min-h-screen bg-ayesa-gray-light">
      <nav className="bg-ayesa-blue shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=40&h=40" 
                alt="Piggy Bank Logo" 
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-xl font-bold text-white">Finanzas Personales</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Dashboard transactions={transactions} />
            </div>
            <div>
              <TransactionForm onSubmit={handleNewTransaction} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;