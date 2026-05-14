const DEFAULT_API_URL = "https://artisanmedinabackend.onrender.com/api";

export const API_URL =
  import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "") || DEFAULT_API_URL;

export const API_ORIGIN = API_URL.replace(/\/api$/i, "");

const ACCESS_TOKEN_KEY = "artisan_access_token";
const REFRESH_TOKEN_KEY = "artisan_refresh_token";

function normalizeToken(value: string | null): string | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;
  if (trimmed === "null" || trimmed === "undefined") return null;
  return trimmed;
}

function extractBearerToken(value: string | null): string | null {
  if (!value) return null;
  const match = value.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  return normalizeToken(match[1]);
}

function normalizeApiEndpoint(endpoint: string): string {
  const trimmed = endpoint.trim();
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  return withLeadingSlash.replace(/^\/api(?=\/|$)/i, "");
}

export function buildApiUrl(endpoint: string): string {
  return `${API_URL}${normalizeApiEndpoint(endpoint)}`;
}

export function buildAssetUrl(assetPath?: string | null): string | null {
  if (!assetPath) return null;

  if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
    return assetPath;
  }

  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;

  return `${API_ORIGIN}${normalizedPath}`;
}

function isPublicEndpoint(endpoint: string): boolean {
  const normalized = normalizeApiEndpoint(endpoint);

  return (
    normalized === "/auth/login" ||
    normalized === "/auth/register" ||
    normalized === "/auth/verify-email" ||
    normalized === "/contact" ||
    normalized.startsWith("/products")
  );
}

function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("artisan_user");
  localStorage.removeItem("artisan_customer");
  localStorage.removeItem("artisan_customer_profile");
  window.dispatchEvent(new CustomEvent("artisan:auth-cleared"));
}

function redirectToSessionExpired() {
  if (window.location.pathname === "/session-expired") return;
  window.location.assign("/session-expired");
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = normalizeToken(localStorage.getItem(ACCESS_TOKEN_KEY));
  const headers = new Headers(options.headers || {});

  const bearerTokenFromHeader = extractBearerToken(
    headers.get("Authorization")
  );

  const hasAuthHeaderAlready = Boolean(bearerTokenFromHeader);
  const shouldAttachToken =
    Boolean(token) && !hasAuthHeaderAlready && !isPublicEndpoint(endpoint);

  if (shouldAttachToken && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(buildApiUrl(endpoint), {
    ...options,
    headers,
  });

  const sentAuth = Boolean(bearerTokenFromHeader) || Boolean(shouldAttachToken && token);

  if (res.status === 401 && sentAuth) {
    clearAuthStorage();
    redirectToSessionExpired();
    throw new Error("SESSION_EXPIRED");
  }

  return res;
}
