export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Category {
  id: number;
  user_id: number;
  name: string;
  color: string;
  icon: string;
}

export interface Expense {
  id: number;
  user_id: number;
  category_id: number | null;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  note?: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  created_at: string;
}

export interface Summary {
  total_income: number;
  total_expense: number;
  balance: number;
  breakdown: { name: string; color: string; icon: string; total: number }[];
  trend: { month: string; income: number; expense: number }[];
}

export interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}
