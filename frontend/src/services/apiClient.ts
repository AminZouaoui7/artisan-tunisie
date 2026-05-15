const DEFAULT_API_URL = "https://artisanmedinabackend.onrender.com/api";

export const API_URL =
  import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "") || DEFAULT_API_URL;

export const API_ORIGIN = API_URL.replace(/\/api$/i, "");

const ACCESS_TOKEN_KEY = "artisan_access_token";
const REFRESH_TOKEN_KEY = "artisan_refresh_token";
const VISITOR_COUNTRY_CODE_KEY = "artisan_visitor_country_code";
const VISITOR_IS_TUNISIA_KEY = "artisan_visitor_is_tunisia";
const LEGACY_VISITOR_COUNTRY_KEYS = [
  "artisan_madina_country",
  "artisan_visitor_country",
];

export type UserLocationDto = {
  countryCode: string;
  isTunisia: boolean;
};

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

function normalizeCountryCode(value: string | null | undefined): string {
  const normalized = value?.trim().toUpperCase() ?? "";

  if (!normalized || normalized === "NULL" || normalized === "UNDEFINED") {
    return "";
  }

  return normalized;
}

function parseStoredBoolean(value: string | null): boolean | null {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
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

export function cleanupVisitorLocationStorage() {
  const storedCountry = normalizeCountryCode(
    localStorage.getItem(VISITOR_COUNTRY_CODE_KEY)
  );

  if (!storedCountry) {
    localStorage.removeItem(VISITOR_COUNTRY_CODE_KEY);
  }

  const storedIsTunisia = parseStoredBoolean(
    localStorage.getItem(VISITOR_IS_TUNISIA_KEY)
  );

  if (storedIsTunisia === null) {
    localStorage.removeItem(VISITOR_IS_TUNISIA_KEY);
  }

  for (const key of LEGACY_VISITOR_COUNTRY_KEYS) {
    const normalizedLegacyValue = normalizeCountryCode(localStorage.getItem(key));

    if (!normalizedLegacyValue) {
      localStorage.removeItem(key);
    }
  }
}

function getLegacyVisitorCountryCode(): string {
  for (const key of LEGACY_VISITOR_COUNTRY_KEYS) {
    const normalized = normalizeCountryCode(localStorage.getItem(key));

    if (normalized) {
      return normalized;
    }
  }

  return "";
}

export function clearVisitorLocationStorage() {
  localStorage.removeItem(VISITOR_COUNTRY_CODE_KEY);
  localStorage.removeItem(VISITOR_IS_TUNISIA_KEY);

  for (const key of LEGACY_VISITOR_COUNTRY_KEYS) {
    localStorage.removeItem(key);
  }
}

export function getVisitorCountryCode(): string {
  cleanupVisitorLocationStorage();

  const storedCountry = normalizeCountryCode(
    localStorage.getItem(VISITOR_COUNTRY_CODE_KEY)
  );

  if (storedCountry) {
    return storedCountry;
  }

  const legacyCountry = getLegacyVisitorCountryCode();

  if (legacyCountry) {
    localStorage.setItem(VISITOR_COUNTRY_CODE_KEY, legacyCountry);
    return legacyCountry;
  }

  return "";
}

export function getVisitorIsTunisia(): boolean {
  cleanupVisitorLocationStorage();

  return parseStoredBoolean(localStorage.getItem(VISITOR_IS_TUNISIA_KEY)) === true;
}

export function getStoredUserLocation(): UserLocationDto {
  return {
    countryCode: getVisitorCountryCode(),
    isTunisia: getVisitorIsTunisia(),
  };
}

export function storeUserLocation(location: UserLocationDto) {
  const normalizedCountryCode = normalizeCountryCode(location.countryCode);

  if (!normalizedCountryCode) return;

  cleanupVisitorLocationStorage();

  localStorage.setItem(VISITOR_COUNTRY_CODE_KEY, normalizedCountryCode);
  localStorage.setItem(
    VISITOR_IS_TUNISIA_KEY,
    location.isTunisia ? "true" : "false"
  );

  for (const key of LEGACY_VISITOR_COUNTRY_KEYS) {
    localStorage.removeItem(key);
  }

  window.dispatchEvent(
    new CustomEvent("artisan:location-changed", {
      detail: {
        countryCode: normalizedCountryCode,
        isTunisia: location.isTunisia,
      },
    })
  );
}

export async function fetchAndStoreUserLocation(): Promise<UserLocationDto> {
  const response = await apiFetch("/user-location", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de charger la localisation utilisateur.");
  }

  const data = (await response.json()) as Partial<UserLocationDto>;

  const location: UserLocationDto = {
    countryCode: normalizeCountryCode(data.countryCode),
    isTunisia: data.isTunisia === true,
  };

  if (!location.countryCode) {
    throw new Error("Réponse de localisation invalide.");
  }

  storeUserLocation(location);
  return location;
}

function isPublicEndpoint(endpoint: string): boolean {
  const normalized = normalizeApiEndpoint(endpoint);

  return (
    normalized === "/auth/login" ||
    normalized === "/auth/register" ||
    normalized === "/auth/verify-email" ||
    normalized === "/auth/google" ||
    normalized === "/auth/google-login" ||
    normalized === "/user-location" ||
    normalized === "/contact" ||
    normalized.startsWith("/products")
  );
}

function isAuthPage(): boolean {
  return (
    window.location.pathname === "/login" ||
    window.location.pathname === "/register" ||
    window.location.pathname === "/verify-email"
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

  const bearerTokenFromHeader = extractBearerToken(headers.get("Authorization"));

  const hasAuthHeaderAlready = Boolean(bearerTokenFromHeader);
  const publicEndpoint = isPublicEndpoint(endpoint);

  const shouldAttachToken =
    Boolean(token) && !hasAuthHeaderAlready && !publicEndpoint;

  if (shouldAttachToken && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const visitorCountry = getVisitorCountryCode();

  if (visitorCountry) {
    headers.set("X-Country-Code", visitorCountry);
  }

  const res = await fetch(buildApiUrl(endpoint), {
    ...options,
    headers,
  });

  const sentAuth =
    Boolean(bearerTokenFromHeader) || Boolean(shouldAttachToken && token);

  if (res.status === 401 && sentAuth) {
    clearAuthStorage();

    if (!isAuthPage()) {
      redirectToSessionExpired();
    }

    throw new Error("SESSION_EXPIRED");
  }

  return res;
}