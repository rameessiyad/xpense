import api from "./axios";

export interface CategoryBreakdown {
  group: string;
  amount: number;
  count: number;
  icon: string;
  percentage: number;
}

export interface MonthlyReport {
  totalExpense: number;
  totalIncome: number;
  totalCount: number;
  avgPerDay: number;
  categoryBreakdown: CategoryBreakdown[];
  weeklyBreakdown: { _id: string; total: number }[];
}

export const getMonthlyReport = async (
  month?: number,
  year?: number,
): Promise<MonthlyReport> => {
  const res = await api.get("/report/monthly", { params: { month, year } });
  return res.data;
};

export const getWeeklyReport = async (): Promise<{
  dailyBreakdown: { _id: string; total: number; count: number }[];
}> => {
  const res = await api.get("/report/weekly");
  return res.data;
};
