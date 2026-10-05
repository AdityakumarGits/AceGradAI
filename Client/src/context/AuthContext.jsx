import { useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");

    setUser(null);
  }, []);

  useEffect(() => {
    let expiryTimer;

    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        // No authentication data
        if (!token || !savedUser) {
          setUser(null);
          return;
        }

        const decoded = decodeToken(token);

        // Invalid JWT
        if (!decoded || !decoded.exp) {
          console.warn("Invalid or malformed JWT");
          logout();
          return;
        }

        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();

        // JWT already expired
        if (expirationTime <= currentTime) {
          console.warn("JWT has expired");
          logout();
          return;
        }

        // Restore user
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Automatically logout when JWT expires
        const remainingTime = expirationTime - currentTime;

        expiryTimer = setTimeout(() => {
          console.warn("JWT expired. Logging out...");
          logout();
        }, remainingTime);
      } catch (error) {
        console.error("Failed to restore authentication:", error);
        logout();
      }
    };

    checkAuth();
    setLoading(false);

    return () => {
      if (expiryTimer) {
        clearTimeout(expiryTimer);
      }
    };
  }, [logout]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};