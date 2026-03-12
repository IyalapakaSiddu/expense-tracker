import { Trash2 } from 'lucide-react';
import type { Expense } from '../types';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

interface Props {
  expenses: Expense[];
  loading: boolean;
  onDelete: (id: number) => void;
}

const ExpenseList = ({ expenses, loading, onDelete }: Props) => {
  if (loading) return <p className="text-gray-400 text-sm text-center py-8">Loading...</p>;
  if (!expenses.length) return <p className="text-gray-400 text-sm text-center py-8">No transactions yet</p>;

  return (
    <ul className="divide-y divide-gray-50">
      {expenses.map((e) => (
        <li key={e.id} className="flex items-center justify-between py-3 group">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: e.category_color || '#6b7280' }} />
            <div>
              <p className="text-sm font-medium text-gray-800">{e.title}</p>
              <p className="text-xs text-gray-400">{e.category_name || 'Uncategorised'} · {e.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold ${e.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
              {e.type === 'income' ? '+' : '-'}{fmt(e.amount)}
            </span>
            <button onClick={() => onDelete(e.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition">
              <Trash2 size={15} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ExpenseList;
