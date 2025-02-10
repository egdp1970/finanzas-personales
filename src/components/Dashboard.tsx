import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, PiggyBank,
  CreditCard, ShoppingCart, Home
} from 'lucide-react';
import { format } from 'date-fns';
import type { Transaction } from '../types';

const COLORS = ['#004990', '#0066CC', '#0088FF', '#66B2FF'];

interface DashboardProps {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
  const calculateBalance = () => {
    return transactions.reduce((acc, curr) => {
      return acc + (curr.type === 'income' ? curr.amount : -curr.amount);
    }, 0);
  };

  const calculateTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const calculateTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const calculateSavings = () => {
    return calculateTotalIncome() - calculateTotalExpenses();
  };

  const getMonthlyData = () => {
    const monthlyData = transactions.reduce((acc: any, curr) => {
      const month = format(curr.date, 'MMM yyyy');
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 };
      }
      if (curr.type === 'income') {
        acc[month].income += curr.amount;
      } else {
        acc[month].expenses += curr.amount;
      }
      return acc;
    }, {});

    return Object.values(monthlyData);
  };

  const getExpensesByCategory = () => {
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc: any, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = 0;
        }
        acc[curr.category] += curr.amount;
        return acc;
      }, {});

    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getTopExpenseCategories = () => {
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc: { [key: string]: number }, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = 0;
        }
        acc[curr.category] += curr.amount;
        return acc;
      }, {});

    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
      }));
  };

  const topCategories = getTopExpenseCategories();

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'comida':
        return <ShoppingCart className="h-8 w-8 text-ayesa-blue" />;
      case 'impuestos':
        return <Home className="h-8 w-8 text-ayesa-blue" />;
      default:
        return <CreditCard className="h-8 w-8 text-ayesa-blue" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-ayesa-gray-dark">Dashboard Financiero</h1>
      
      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ayesa-gray-dark">Balance Total</p>
              <p className="text-2xl font-bold text-ayesa-blue">${calculateBalance().toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-ayesa-blue" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ayesa-gray-dark">Ingresos</p>
              <p className="text-2xl font-bold text-ayesa-blue">
                ${calculateTotalIncome().toFixed(2)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-ayesa-blue" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ayesa-gray-dark">Gastos</p>
              <p className="text-2xl font-bold text-ayesa-blue">
                ${calculateTotalExpenses().toFixed(2)}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-ayesa-blue" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ayesa-gray-dark">Ahorros</p>
              <p className="text-2xl font-bold text-ayesa-blue">
                ${calculateSavings().toFixed(2)}
              </p>
            </div>
            <PiggyBank className="h-8 w-8 text-ayesa-blue" />
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-ayesa-gray-dark">Ingresos vs Gastos</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getMonthlyData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#004990" name="Ingresos" />
                <Bar dataKey="expenses" fill="#0066CC" name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-ayesa-gray-dark">Distribución de Gastos</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getExpensesByCategory()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#004990"
                  dataKey="value"
                >
                  {getExpensesByCategory().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 3 Categorías de Gastos */}
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-4 text-ayesa-gray-dark">Top 3 Categorías de Gastos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCategories.map((item, index) => (
            <div key={item.category} className="flex items-center space-x-4 p-4 bg-ayesa-gray-light rounded-lg hover:bg-opacity-75 transition-colors">
              {getCategoryIcon(item.category)}
              <div>
                <p className="font-semibold text-ayesa-gray-dark">{item.category}</p>
                <p className="text-ayesa-blue">
                  ${item.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}