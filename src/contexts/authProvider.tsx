import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type User } from "./authContext";
import { loginUser, logoutUser, type LoginData } from "../services/authService";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load user + token on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const cookieToken = Cookies.get("authToken");
    if (cookieToken) setToken(cookieToken);
  }, []);

  // 🔹 Login
  const login = async (data: LoginData) => {
    try {
      const response = await loginUser(data);
      if (response?.user) {
        setUser(response.user);
        localStorage.setItem("authUser", JSON.stringify(response.user));

        const cookieToken = Cookies.get("authToken");
        if (cookieToken) setToken(cookieToken);

        return response;
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Error in Login");
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setToken(null);
      localStorage.removeItem("authUser");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
