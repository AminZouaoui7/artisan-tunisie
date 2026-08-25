export const DEFAULT_BACKEND_API_URL =
  "https://artisanmedinabackend.onrender.com/api";

export function getBackendApiUrl(value) {
  const candidate = (value || DEFAULT_BACKEND_API_URL).trim().replace(/\/+$/, "");
  const parsed = new URL(candidate);
  const pathname = parsed.pathname.replace(/\/+$/, "");

  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error("The backend API URL must use HTTP or HTTPS.");
  }

  if (pathname && pathname !== "/api") {
    throw new Error(
      `Invalid backend API URL path "${pathname}". Expected the origin or /api.`
    );
  }

  parsed.pathname = "/api";
  parsed.search = "";
  parsed.hash = "";

  return parsed.toString().replace(/\/+$/, "");
}
