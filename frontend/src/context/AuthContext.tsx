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

type AuthContextType = {
  user: CustomerProfile | null;
  token: string | null;
  loadingAuth: boolean;
  isAuthenticated: boolean;
  login: (data: LoginDto) => Promise<void>;
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    setToken(null);
    setUser(null);
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
      setLoadingAuth(false);
      return;
    }

    try {
      const currentUser = await authService.me(savedToken);

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

    localStorage.setItem(TOKEN_KEY, result.token);

    if (result.refreshToken) {
      localStorage.setItem(
        REFRESH_TOKEN_KEY,
        result.refreshToken
      );
    }

    setToken(result.token);

    const currentUser = await authService.me(result.token);

    setUser(currentUser);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      loadingAuth,
      isAuthenticated: !!token && !!user,
      login,
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
    throw new Error(
      "useAuth doit être utilisé dans AuthProvider"
    );
  }

  return context;
}
