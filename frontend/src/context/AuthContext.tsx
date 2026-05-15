import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerProfile | null>(null);

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [loadingAuth, setLoadingAuth] = useState(true);

  const clearSession = () => {
    clearStoredSession();
    localStorage.removeItem("artisan_user");

    setToken(null);
    setUser(null);
  };

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
    refreshUser();
  }, []);

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
