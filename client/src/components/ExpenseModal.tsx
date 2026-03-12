import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { useCategories } from '../hooks/useExpenses';
import type { Expense } from '../types';

interface Props {
  onClose: () => void;
  onSave: (payload: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
}

const ExpenseModal = ({ onClose, onSave }: Props) => {
  const { categories } = useCategories();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      await onSave({
        title:       fd.get('title') as string,
        amount:      parseFloat(fd.get('amount') as string),
        type:        fd.get('type') as 'income' | 'expense',
        date:        fd.get('date') as string,
        category_id: fd.get('category_id') ? parseInt(fd.get('category_id') as string) : null,
        note:        fd.get('note') as string,
      });
      onClose();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-800 text-lg">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Type</label>
              <select name="type" required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Date</label>
              <input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Title</label>
            <input name="title" type="text" placeholder="e.g. Lunch at cafe" required
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Amount (₹)</label>
            <input name="amount" type="number" step="0.01" min="0.01" placeholder="0.00" required
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Category</label>
            <select name="category_id"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">Uncategorised</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Note (optional)</label>
            <input name="note" type="text" placeholder="Any extra detail"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60">
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
