import { createContext, useContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

// 👇 default value (empty)
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
