import api from './axios';
import { User } from '../types';

export const updateProfile = async (data: {
  name: string;
  currency: string;
}): Promise<User> => {
  const res = await api.put('/auth/update-profile', data);
  return res.data.user;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await api.put('/auth/change-password', data);
};

export const deleteAccount = async (): Promise<void> => {
  await api.delete('/auth/delete-account');
};

export const getStats = async (): Promise<{
  totalTransactions: number;
  monthTotal: number;
  totalCategories: number;
}> => {
  const [transRes, monthRes, catRes] = await Promise.all([
    api.get('/transactions', { params: { limit: 1 } }),
    api.get('/transactions/month-to-date'),
    api.get('/categories'),
  ]);

  return {
    totalTransactions: transRes.data.total,
    monthTotal: monthRes.data.monthTotal,
    totalCategories: catRes.data.count,
  };
};