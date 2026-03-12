import { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useSummary, useExpenses } from '../hooks/useExpenses';
import ExpenseModal from '../components/ExpenseModal';
import ExpenseList from '../components/ExpenseList';
import Navbar from '../components/Navbar';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const Dashboard = () => {
  const [month, setMonth]       = useState(() => new Date().toISOString().slice(0, 7));
  const [showModal, setModal]   = useState(false);
  const { summary, loading: sl } = useSummary(month);
  const { expenses, loading: el, addExpense, deleteExpense } = useExpenses(month);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Month picker */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-3">
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <button onClick={() => setModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Balance',  value: summary?.balance,       icon: Wallet,       color: 'indigo' },
            { label: 'Income',   value: summary?.total_income,  icon: TrendingUp,   color: 'green'  },
            { label: 'Expenses', value: summary?.total_expense, icon: TrendingDown, color: 'red'    },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{label}</span>
                <div className={`p-2 rounded-xl bg-${color}-50`}>
                  <Icon size={18} className={`text-${color}-500`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {sl ? '—' : fmt(value ?? 0)}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Trend bar chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-700 mb-4">6-Month Trend</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={summary.trend}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="income"  fill="#6366f1" radius={[4,4,0,0]} name="Income" />
                  <Bar dataKey="expense" fill="#f43f5e" radius={[4,4,0,0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category pie chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-700 mb-4">By Category</h2>
              {summary.breakdown.filter(b => b.total > 0).length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-12">No expenses this month</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={summary.breakdown.filter(b => b.total > 0)}
                      dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                      {summary.breakdown.filter(b => b.total > 0).map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmt(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* Expense list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Transactions</h2>
          <ExpenseList expenses={expenses} loading={el} onDelete={deleteExpense} />
        </div>
      </main>

      {showModal && (
        <ExpenseModal onClose={() => setModal(false)} onSave={addExpense} />
      )}
    </div>
  );
};

export default Dashboard;
