export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}