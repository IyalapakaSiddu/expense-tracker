import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import type { Expense, Summary, Category } from '../types';

export const useExpenses = (month?: string) => {
  const [expenses, setExpenses]   = useState<Expense[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = month ? { month } : {};
      const { data } = await api.get('/expenses', { params });
      setExpenses(data);
    } catch {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { fetch(); }, [fetch]);

  const addExpense = async (payload: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
    const { data } = await api.post('/expenses', payload);
    setExpenses((prev) => [data, ...prev]);
    return data;
  };

  const updateExpense = async (id: number, payload: Partial<Expense>) => {
    const { data } = await api.put(`/expenses/${id}`, payload);
    setExpenses((prev) => prev.map((e) => (e.id === id ? data : e)));
    return data;
  };

  const deleteExpense = async (id: number) => {
    await api.delete(`/expenses/${id}`);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return { expenses, loading, error, refetch: fetch, addExpense, updateExpense, deleteExpense };
};

export const useSummary = (month?: string) => {
  const [summary, setSummary]   = useState<Summary | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = month ? { month } : {};
    api.get('/expenses/summary', { params })
      .then(({ data }) => setSummary(data))
      .finally(() => setLoading(false));
  }, [month]);

  return { summary, loading };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/expenses/categories').then(({ data }) => setCategories(data));
  }, []);

  return { categories };
};
