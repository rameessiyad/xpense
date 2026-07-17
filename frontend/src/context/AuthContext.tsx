import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { getToken, removeToken, saveToken } from "../utils/storage";
import api from "../api/axios";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await getToken();
        if (storedToken) {
          setToken(storedToken);
          //fetch user profile
          const res = await api.get("/auth/me");
          setUser(res.data.user);
        }
      } catch (error) {
        //token expired or invalid
        await removeToken();
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (token: string, user: User) => {
    await saveToken(token);
    setToken(token);
    setUser({ ...user, token });
  };

  const logout = async () => {
    await removeToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
