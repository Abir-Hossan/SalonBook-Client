import { apiFetch } from "./api-fetch";

export type Account = { id: string; name: string; email: string; image?: string; role: "admin" | "customer" };
export type ApiAppointment = {
  id: string; serviceId: string; appointmentDate: string; timeSlot: string;
  servicePrice: number; status: "pending" | "confirmed" | "cancelled"; paymentStatus: "paid" | "unpaid";
  message?: string; serviceName?: string; serviceImage?: string; serviceDuration?: number;
};
type PageMeta = { page: number; limit: number; total: number; totalPages: number };
export class ApiError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}
async function request<T>(path: string, init: RequestInit, base: string): Promise<{ data: T; meta?: PageMeta }> {
  const response = await apiFetch(base + path, init);
  if (response.status === 204) return { data: undefined as T };
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new ApiError(body?.errors?.[0]?.message || body?.message || "The SalonBook API is unavailable.", response.status);
  }
  return { data: body.data as T, meta: body.meta };
}
export async function api<T>(path: string, init: RequestInit = {}, base = "/salon-api"): Promise<T> {
  return (await request<T>(path, init, base)).data;
}
export async function apiPage<T>(path: string, init: RequestInit = {}) {
  const { data, meta } = await request<T[]>(path, init, "/salon-api");
  return { data, totalPages: Math.max(1, meta?.totalPages ?? 1) };
}
export function json(method: string, body: unknown): RequestInit {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
