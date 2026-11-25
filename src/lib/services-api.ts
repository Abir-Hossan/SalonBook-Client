import type { Service } from "@/types";
import { apiFetch } from "./api-fetch";
import { serverApiTarget } from "./api-target";

type PageMeta = { page: number; limit: number; total: number; totalPages: number };
type ApiResponse<T> = { success: boolean; message: string; data: T; meta: PageMeta | null };

export class ServiceApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function read<T>(path: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
  const base = typeof window === "undefined" ? serverApiTarget() : "/catalogue-api";
  const response = await apiFetch(`${base}/services${path}`, { signal });
  const payload = await response.json().catch(() => null) as ApiResponse<T> | null;
  if (!response.ok || !payload?.success || payload.data == null) {
    throw new ServiceApiError(payload?.message || "The service catalogue is temporarily unavailable.", response.ok ? 503 : response.status);
  }
  return payload;
}

export const listServices = (query: URLSearchParams, signal?: AbortSignal) =>
  read<Service[]>(`?${query}`, signal);

export const listServiceCategories = (signal?: AbortSignal) => read<string[]>("/categories", signal);

export async function getService(id: string) {
  return (await read<Service>(`/${encodeURIComponent(id)}`)).data;
}
