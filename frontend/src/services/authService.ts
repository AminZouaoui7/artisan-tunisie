import { apiFetch } from "./apiClient";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5163";

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

export type LoginDto = {
  email: string;
  password: string;
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

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await apiFetch(
    url.replace("/api", ""),
    {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      ...options,
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.message || "Une erreur est survenue."
    );
  }

  return response.json();
}

export const authService = {
  register: (data: RegisterDto) =>
    request<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyEmail: (data: VerifyEmailDto) =>
    request<{ message: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginDto) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: (token: string) =>
    request<CustomerProfile>("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  logout: (token: string) =>
    request<{ message: string }>("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  requestChangePasswordCode: (
    token: string
  ) =>
    request<{ message: string }>(
      "/api/auth/change-password/request-code",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  confirmChangePassword: (
    token: string,
    data: ChangePasswordConfirmDto
  ) =>
    request<{ message: string }>(
      "/api/auth/change-password/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    ),
};
