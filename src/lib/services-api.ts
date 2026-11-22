import type { Service } from "@/types";

type PageMeta = { page: number; limit: number; total: number; totalPages: number };
type ApiResponse<T> = { success: boolean; message: string; data: T; meta: PageMeta | null };
const baseUrl = typeof window === "undefined"
  ? (process.env.SALONBOOK_API_URL || process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:5000/api").replace(/\/$/, "")
  : "/catalogue-api";

export class ServiceApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function read<T>(path: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
  const response = await fetch(`${baseUrl}/services${path}`, { signal, cache: "no-store" });
  const payload = await response.json() as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    throw new ServiceApiError(payload.message || "The service catalogue is unavailable.", response.status);
  }
  return payload;
}

export const listServices = (query: URLSearchParams, signal?: AbortSignal) =>
  read<Service[]>(`?${query}`, signal);

export const listServiceCategories = (signal?: AbortSignal) => read<string[]>("/categories", signal);

export async function getService(id: string) {
  return (await read<Service>(`/${encodeURIComponent(id)}`)).data;
}
