export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface Transaction {
  _id: string;
  userId: string;
  categoryId: {
    _id: string;
    name: string;
    icon: string;
    group: string;
  };
  amount: number;
  type: "Expense" | "Income";
  note?: string;
  date: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  type: "Expense" | "Income";
  group: string;
  isDefault: boolean;
}

export interface Budget {
  _id: string;
  categoryId: string;
  monthlyLimit: number;
  month: string;
  year: number;
  thresholds: number[];
}

export interface ApiError {
  success: false;
  message: string;
}
