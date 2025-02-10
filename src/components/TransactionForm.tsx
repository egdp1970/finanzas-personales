import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { Transaction } from '../types';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

const incomeCategories = [
  'Nómina Edu',
  'Nómina Ana',
  'Alquileres',
  'Pagas extra',
  'Otros'
];

const expenseCategories = [
  'Comida',
  'Ropa',
  'Impuestos',
  'Teléfono',
  'Energía',
  'Otros'
];

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    
    // Crear una fecha con el mes seleccionado
    const [year, month] = selectedMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    
    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
    });
    
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-4 text-ayesa-gray-dark">Nueva Transacción</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              type === 'income'
                ? 'bg-ayesa-blue text-white'
                : 'bg-ayesa-gray-light text-ayesa-gray-dark hover:bg-opacity-75'
            }`}
            onClick={() => setType('income')}
          >
            Ingreso
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              type === 'expense'
                ? 'bg-ayesa-blue text-white'
                : 'bg-ayesa-gray-light text-ayesa-gray-dark hover:bg-opacity-75'
            }`}
            onClick={() => setType('expense')}
          >
            Gasto
          </button>
        </div>

        <div>
          <label htmlFor="month" className="block text-sm font-medium text-ayesa-gray-dark">
            Mes
          </label>
          <input
            type="month"
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ayesa-blue focus:ring-ayesa-blue"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-ayesa-gray-dark">
            Cantidad
          </label>
          <input
            id="amount"
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ayesa-blue focus:ring-ayesa-blue"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-ayesa-gray-dark">
            Categoría
          </label>
          <select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ayesa-blue focus:ring-ayesa-blue"
          >
            <option value="">Seleccionar categoría</option>
            {type === 'income' 
              ? incomeCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              : expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
            }
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-ayesa-gray-dark">
            Descripción
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ayesa-blue focus:ring-ayesa-blue"
            placeholder="Descripción de la transacción"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ayesa-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ayesa-blue transition-colors"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Agregar Transacción
        </button>
      </form>
    </div>
  );
}