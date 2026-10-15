import { apiRequest } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/token";

type LoginResponse = {
  token: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterCredentials = {
  email: string;
  password: string;
};

export const authService = {
  getToken,
  setToken,
  clearToken,

  isAuthenticated(): boolean {
    return getToken() !== null;
  },

  async login({ email, password }: LoginCredentials): Promise<string> {
    const { token } = await apiRequest<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    await setToken(token);
    return token;
  },

  async register({ email, password }: RegisterCredentials): Promise<void> {
    await apiRequest("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async logout(): Promise<void> {
    await clearToken();
  },
};
