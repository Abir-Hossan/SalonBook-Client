const localApi = "http://127.0.0.1:5000/api";

export function apiTarget(configured: string | undefined, legacy: string | undefined, production: boolean) {
  const value = configured?.trim() || legacy?.trim();
  if (!value && !production) return localApi;
  if (!value) throw new Error("SALONBOOK_API_URL is required for a production build. Set it for the Vercel deployment environment.");

  let target: URL;
  try {
    target = new URL(value);
  } catch {
    throw new Error("SALONBOOK_API_URL must be an absolute Express API URL ending in /api.");
  }
  const host = target.hostname.replace(/\.$/, "");
  const nonPublicHost = !host.includes(".") || /(^|\.)(localhost|local)$|^(0\.|10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.|\[)/i.test(host);
  if (target.username || target.password || target.search || target.hash || !/^\/api\/?$/.test(target.pathname) ||
      !["http:", "https:"].includes(target.protocol) ||
      (production && (target.protocol !== "https:" || nonPublicHost))) {
    throw new Error("SALONBOOK_API_URL must point to the Express /api URL without credentials, query or fragment. Production requires a public HTTPS host.");
  }
  return target.origin + "/api";
}

export function serverApiTarget() {
  return apiTarget(process.env.SALONBOOK_API_URL, process.env.NEXT_PUBLIC_API_URL, process.env.NODE_ENV === "production");
}
