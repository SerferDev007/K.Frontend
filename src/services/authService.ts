// api/authService.ts

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface LoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
}

export const loginUser = async (data: LoginData): Promise<UserResponse> => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Login failed");
  return result.user;
};

export const logoutUser = async (): Promise<string> => {
  const res = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Logout failed");
  return result.message;
};
