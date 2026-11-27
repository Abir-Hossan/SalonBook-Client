export async function apiFetch(input: string, options: RequestInit = {}) {
  const timeout = AbortSignal.timeout(25_000);
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;
  try {
    return await fetch(input, { ...options, cache: "no-store", signal });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    if (timeout.aborted) throw new Error("SalonBook did not respond in time. Check your account or booking before retrying a submitted action.");
    throw new Error("SalonBook is temporarily unavailable. Please try again.");
  }
}
