import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

const readSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("streamflix_user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (_error) {
    localStorage.removeItem("streamflix_user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readSavedUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => {
        localStorage.setItem("streamflix_user", JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("streamflix_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSession = ({ user: nextUser }) => {
    try {
      localStorage.setItem("streamflix_user", JSON.stringify(nextUser));
    } catch (_error) {
      // The cookie still keeps the server session alive.
    }
    setUser(nextUser);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveSession(data);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    saveSession(data);
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => null);
    localStorage.removeItem("streamflix_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
