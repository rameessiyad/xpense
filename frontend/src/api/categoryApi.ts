import api from "./axios";
import { Category } from "../types";

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get("/category");
  return res.data.data;
};

export const createCategory = async (data: {
  name: string;
  icon: string;
  type: "Expense" | "Income";
  group: string;
}): Promise<Category> => {
  const res = await api.post("/category", data);
  return res.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/category/${id}`);
};
