import { API_URL } from "./config";
import { clearToken, getToken } from "./token";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ErrorResponse = {
  error?: string;
};

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  onUnauthorized = handler;
}

function isAuthRequest(path: string): boolean {
  return path.includes("/auth/login") || path.includes("/auth/register");
}

async function handleUnauthorized(path: string): Promise<void> {
  if (isAuthRequest(path)) return;

  await clearToken();
  onUnauthorized?.();
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers = new Headers(options?.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data: T & ErrorResponse = await response.json().catch(() => ({}) as T & ErrorResponse);

  if (response.status === 401) {
    await handleUnauthorized(path);
    throw new ApiError(response.status, data.error ?? "Unauthorized");
  }

  if (!response.ok) {
    throw new ApiError(response.status, data.error ?? "Request failed");
  }

  return data;
}
