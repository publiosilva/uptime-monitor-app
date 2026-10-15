import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "token";

let memoryToken: string | null = null;

export function getToken(): string | null {
  return memoryToken;
}

export async function loadToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      memoryToken = typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    } catch {
      memoryToken = null;
    }
    return memoryToken;
  }

  memoryToken = await SecureStore.getItemAsync(TOKEN_KEY);
  return memoryToken;
}

export async function setToken(token: string): Promise<void> {
  memoryToken = token;

  if (Platform.OS === "web") {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // ignore
    }
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  memoryToken = null;

  if (Platform.OS === "web") {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
