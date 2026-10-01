import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshToken,
  registerUser,
} from "../api/authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const data = await refreshToken();
        const profile = await getCurrentUser(data.accessToken);
        setUser(profile.user);
        setAccessToken(data.accessToken);
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    setAccessToken(data.accessToken);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    return registerUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const data = await refreshToken();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isLoading,
      isAuthenticated: Boolean(accessToken),
      login,
      register,
      logout,
      refreshAccessToken,
    }),
    [user, accessToken, isLoading, login, register, logout, refreshAccessToken],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export default AuthContext;
