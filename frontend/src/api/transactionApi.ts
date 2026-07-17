import api from "./axios";
import { Transaction } from "../types";

export const getTransactions = async (params?: {
  type?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Transaction[]; total: number; totalPages: number }> => {
  const res = await api.get("/transaction", { params });
  return res.data;
};

export const getTodayTransactions = async (): Promise<{
  todayTotal: number;
  data: Transaction[];
}> => {
  const res = await api.get("/transaction/today");
  return res.data;
};

export const getMonthToDate = async (): Promise<{
  monthTotal: number;
  dailyBreakdown: { date: string; total: number }[];
  data: Transaction[];
}> => {
  const res = await api.get("/transaction/month-to-date");
  return res.data;
};

export const createTransaction = async (data: {
  categoryId: string;
  amount: number;
  type: "Expense" | "Income";
  note?: string;
  date?: string;
}): Promise<Transaction> => {
  const res = await api.post("/transaction", data);
  return res.data.data;
};

export const updateTransaction = async (
  id: string,
  data: Partial<Transaction>,
): Promise<Transaction> => {
  const res = await api.put(`/transaction/${id}`, data);
  return res.data.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};
