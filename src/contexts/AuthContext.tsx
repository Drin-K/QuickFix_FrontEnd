import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type PropsWithChildren,
} from "react";
import type { AuthUser } from "@/types/auth";

const STORAGE_TOKEN_KEY = "quickfix_token";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  const setToken = useCallback((nextToken: string | null) => {
    if (nextToken) {
      localStorage.setItem(STORAGE_TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    }
    setTokenState(nextToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      setToken,
      setUser,
      logout,
    }),
    [logout, setToken, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
