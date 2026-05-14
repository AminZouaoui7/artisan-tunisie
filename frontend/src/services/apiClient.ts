const API_BASE_URL = "http://localhost:5163";
const API_URL = `${API_BASE_URL}/api`;

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

function isPublicEndpoint(endpoint: string): boolean {
  return (
    endpoint === "/auth/login" ||
    endpoint === "/auth/register" ||
    endpoint === "/auth/verify-email" ||
    endpoint === "/contact" ||
    endpoint.startsWith("/products")
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

  const res = await fetch(`${API_URL}${endpoint}`, {
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
