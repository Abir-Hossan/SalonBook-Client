import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError, type Account } from "./account-api";

const base = (process.env.SALONBOOK_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api").replace(/\/$/, "");

export async function currentAccount() {
  const accepted = new Set(["salonbook_session", "salonbook.session_token", "__Secure-salonbook.session_token"]);
  const authCookies = (await cookies()).getAll().filter(({ name }) => accepted.has(name));
  if (!authCookies.length) return null;
  try {
    return await api<Account>("/auth/me", { headers: { Cookie: authCookies.map(({ name, value }) => name + "=" + value).join("; ") } }, base);
  } catch (error) {
    if (error instanceof ApiError && [401, 403].includes(error.status)) return null;
    throw error;
  }
}

export async function requireAccount(role: Account["role"]) {
  const account = await currentAccount();
  if (!account || account.role !== role) redirect("/sign-in");
  return account;
}
