export type Account = { id: string; name: string; email: string; image?: string; role: "admin" | "customer" };
export type ApiAppointment = {
  id: string; serviceId: string; appointmentDate: string; timeSlot: string;
  servicePrice: number; status: "pending" | "confirmed" | "cancelled"; paymentStatus: "paid" | "unpaid";
};
export class ApiError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}
export async function api<T>(path: string, init: RequestInit = {}, base = "/salon-api"): Promise<T> {
  const response = await fetch(base + path, { ...init, cache: "no-store" });
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new ApiError(body?.errors?.[0]?.message || body?.message || "The SalonBook API is unavailable.", response.status);
  }
  return body.data as T;
}
export function json(method: string, body: unknown): RequestInit {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
