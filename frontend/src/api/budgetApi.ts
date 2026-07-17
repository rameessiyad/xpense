import api from "./axios";

export interface BudgetData {
  _id: string;
  categoryId: { _id: string; name: string; icon: string; group: string } | null;
  monthlyLimit: number;
  month: string;
  year: number;
  thresholds: number[];
  spent: number;
  remaining: number;
  percentage: number;
}

export const getBudgets = async (): Promise<BudgetData[]> => {
  const res = await api.get("/budget");
  return res.data.data;
};

export const createBudget = async (data: {
  categoryId?: string;
  monthlyLimit: number;
  thresholds?: number[];
}): Promise<BudgetData> => {
  const res = await api.post("/budget", data);
  return res.data.data;
};

export const updateBudget = async (
  id: string,
  data: { monthlyLimit: number },
): Promise<BudgetData> => {
  const res = await api.put(`/budget/${id}`, data);
  return res.data.data;
};

export const deleteBudget = async (id: string): Promise<void> => {
  await api.delete(`/budget/${id}`);
};
