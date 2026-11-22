import { api, type Account } from "./account-api";

const authPath = "/api/better-auth";

export async function authRequest<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(authPath + path, {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) {
    throw new Error(result?.message || "Account services are temporarily unavailable. Try again.");
  }
  return result as T;
}

export async function authenticatedAccount(): Promise<Account> {
  return api<Account>("/auth/me");
}
