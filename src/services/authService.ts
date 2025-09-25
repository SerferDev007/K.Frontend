// api/authService.ts

import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const result = await res.json();
  console.log(result);
  if (!res.ok) toast.error(result.message || "Login failed");

  return result as LoginResponse;
};

export const logoutUser = async (): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) toast.error(result.message || "Logout failed");
  return result as { message: string };
};
