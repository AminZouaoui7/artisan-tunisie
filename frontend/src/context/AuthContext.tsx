import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  authService,
  type CustomerProfile,
  type LoginDto,
} from "../services/authService";
import { clearSession as clearStoredSession } from "../services/apiClient";

type AuthContextType = {
  user: CustomerProfile | null;
  token: string | null;
  loadingAuth: boolean;
  isAuthenticated: boolean;
  login: (data: LoginDto) => Promise<void>;
  loginWithGoogle: (accessToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "artisan_access_token";
const REFRESH_TOKEN_KEY = "artisan_refresh_token";

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );

    return JSON.parse(window.atob(padded)) as { exp?: number };
  } catch {
    return null;
  }
}

function isTokenExpired(token: string | null): boolean {
  if (!token) {
    return false;
  }

  const payload = decodeJwtPayload(token);

  if (!payload || typeof payload.exp !== "number") {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<CustomerProfile | null>(null);

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [loadingAuth, setLoadingAuth] = useState(true);

  const clearSession = useCallback(() => {
    clearStoredSession();
    localStorage.removeItem("artisan_user");

    setToken(null);
    setUser(null);
  }, []);

  const handleSessionExpired = useCallback(() => {
    clearStoredSession();
    localStorage.removeItem("artisan_user");

    setToken(null);
    setUser(null);
    setLoadingAuth(false);

    if (window.location.pathname !== "/session-expired") {
      navigate("/session-expired", { replace: true });
    }
  }, [navigate]);

  const saveSession = async (accessToken: string, refreshToken?: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    setToken(accessToken);

    const currentUser = await authService.me(accessToken);
    localStorage.setItem("artisan_user", JSON.stringify(currentUser));
    setUser(currentUser);
  };

  const logout = () => {
    const savedToken = localStorage.getItem(TOKEN_KEY);

    if (savedToken) {
      authService.logout(savedToken).catch(() => {
        // Même si le backend ne répond pas, on vide la session côté front.
      });
    }

    clearSession();
  };

  const refreshUser = async () => {
    const savedToken = localStorage.getItem(TOKEN_KEY);

    if (!savedToken) {
      setUser(null);
      setToken(null);
      setLoadingAuth(false);
      return;
    }

    if (isTokenExpired(savedToken)) {
      handleSessionExpired();
      return;
    }

    try {
      const currentUser = await authService.me(savedToken);

      localStorage.setItem("artisan_user", JSON.stringify(currentUser));
      setUser(currentUser);
      setToken(savedToken);
    } catch {
      clearSession();
    } finally {
      setLoadingAuth(false);
    }
  };

  const login = async (data: LoginDto) => {
    const result = await authService.login(data);

    await saveSession(result.token, result.refreshToken);
  };

  const loginWithGoogle = async (accessToken: string) => {
    const result = await authService.googleAuth(accessToken);

    localStorage.setItem(TOKEN_KEY, result.token);

    if (result.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
    }

    setToken(result.token);

    if (result.customer) {
      setUser(result.customer);
      localStorage.setItem("artisan_user", JSON.stringify(result.customer));
      return;
    }

    const currentUser = await authService.me(result.token);
    localStorage.setItem("artisan_user", JSON.stringify(currentUser));
    setUser(currentUser);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);

    if (savedToken && isTokenExpired(savedToken)) {
      handleSessionExpired();
      return;
    }

    refreshUser();
  }, [handleSessionExpired]);

  useEffect(() => {
    const blockExpiredSessionAction = (event: Event) => {
      const currentToken = localStorage.getItem(TOKEN_KEY);

      if (!currentToken || !isTokenExpired(currentToken)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if ("stopImmediatePropagation" in event) {
        event.stopImmediatePropagation();
      }

      handleSessionExpired();
    };

    const guardedEvents = ["click", "keydown", "submit", "touchstart"];

    guardedEvents.forEach((eventName) => {
      document.addEventListener(eventName, blockExpiredSessionAction, true);
    });

    return () => {
      guardedEvents.forEach((eventName) => {
        document.removeEventListener(eventName, blockExpiredSessionAction, true);
      });
    };
  }, [handleSessionExpired]);

  useEffect(() => {
    const handleAuthCleared = () => {
      setToken(null);
      setUser(null);
      setLoadingAuth(false);
    };

    window.addEventListener("artisan:auth-cleared", handleAuthCleared);

    return () => {
      window.removeEventListener("artisan:auth-cleared", handleAuthCleared);
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      loadingAuth,
      isAuthenticated: !!token && !!user,
      login,
      loginWithGoogle,
      logout,
      refreshUser,
    }),
    [user, token, loadingAuth]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }

  return context;
}
