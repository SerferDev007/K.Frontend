import { createContext } from "react";
import type { LoginData, LoginResponse } from "../services/authService";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<LoginResponse | undefined>;
  logout: () => Promise<void>;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
