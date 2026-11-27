import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError, type Account } from "./account-api";
import { serverApiTarget } from "./api-target";

export async function currentAccount() {
  const accepted = new Set(["salonbook_session", "salonbook.session_token", "__Secure-salonbook.session_token"]);
  const authCookies = (await cookies()).getAll().filter(({ name }) => accepted.has(name));
  if (!authCookies.length) return null;
  try {
    return await api<Account>("/auth/me", { headers: { Cookie: authCookies.map(({ name, value }) => name + "=" + value).join("; ") } }, serverApiTarget());
  } catch (error) {
    if (error instanceof ApiError && [401, 403].includes(error.status)) return null;
    throw error;
  }
}

export async function requireAccount(role: Account["role"]) {
  const account = await currentAccount();
  if (!account) redirect("/sign-in");
  if (account.role !== role) redirect(role === "admin" ? "/sign-in?reason=admin-required" : "/sign-in");
  return account;
}
