import { apiFetch } from "./apiClient";

export type RegisterDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
  email: string;
  confirmationCodeForDev?: string;
};

export type VerifyEmailDto = {
  email: string;
  code: string;
};

export type ResendVerificationEmailDto = {
  email: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type GoogleAuthDto = {
  accessToken: string;
};

export type CustomerProfile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
  expiresAt: string;
  refreshTokenExpiresAt: string;
  customer: CustomerProfile;
};

export type ChangePasswordConfirmDto = {
  currentPassword: string;
  newPassword: string;
  code: string;
};

export type AuthErrorPayload = {
  message?: string;
  code?: string;
  status?: string;
  errorCode?: string;
};

export class AuthError extends Error {
  payload?: AuthErrorPayload;

  constructor(message: string, payload?: AuthErrorPayload) {
    super(message);
    this.name = "AuthError";
    this.payload = payload;
  }
}

function normalizeAuthErrorCode(payload?: AuthErrorPayload | null): string | null {
  if (!payload) return null;

  const codes = [
    payload.code,
    payload.status,
    payload.errorCode,
    payload.message,
  ];

  for (const raw of codes) {
    if (!raw) continue;

    const normalized = String(raw).trim().toUpperCase();

    if (normalized.includes("EMAIL_NOT_VERIFIED")) return "EMAIL_NOT_VERIFIED";
    if (normalized.includes("EMAILNOTVERIFIED")) return "EMAIL_NOT_VERIFIED";
    if (normalized.includes("EMAIL_NON_VERIFIE")) return "EMAIL_NOT_VERIFIED";
    if (normalized.includes("CONFIRMER_VOTRE_EMAIL")) return "EMAIL_NOT_VERIFIED";
    if (normalized.includes("VOTRE EMAIL") && normalized.includes("CONFIRMER")) {
      return "EMAIL_NOT_VERIFIED";
    }
  }

  return null;
}

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await apiFetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const data = (await response
      .json()
      .catch(() => null)) as AuthErrorPayload | null;

    const message =
      (data && typeof data.message === "string" && data.message) ||
      "Une erreur est survenue.";

    const code = normalizeAuthErrorCode(data);

    if (code) {
      const error = new AuthError(message, {
        ...(data || {}),
        code,
      });
      throw error;
    }

    throw new Error(message);
  }

  return response.json();
}

export const authService = {
  register: (data: RegisterDto) =>
    request<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyEmail: (data: VerifyEmailDto) =>
    request<{ message: string }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resendVerificationEmail: (data: ResendVerificationEmailDto) =>
    request<{ message: string }>("/auth/verify-email/resend", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginDto) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  googleAuth: (accessToken: string) =>
    request<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ accessToken }),
    }),

  me: (token: string) =>
    request<CustomerProfile>("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  logout: (token: string) =>
    request<{ message: string }>("/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  requestChangePasswordCode: (token: string) =>
    request<{ message: string }>("/auth/change-password/request-code", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  confirmChangePassword: (
    token: string,
    data: ChangePasswordConfirmDto
  ) =>
    request<{ message: string }>("/auth/change-password/confirm", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),
};
