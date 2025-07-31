import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  clearTokens,
  clearUser,
  getUserFromStorage,
  setAccessToken,
  setRefreshToken,
  setUserToStorage
} from "@/utils/token-storage.js";
const UserContext = createContext(null);
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/128/6997/6997662.png";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    email: null,
    role: null,
  });

  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);

  const login = ({ id, email, role, accessToken, refreshToken }) => {
    const userData = { id, email, role };
    setUser(userData);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserToStorage(userData);
  };

  const logout = () => {
    setUser({ id: null, email: null, role: null });
    clearTokens();
    clearUser();
    setAvatarUrl(DEFAULT_AVATAR);
  };

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const value = { user, loading, avatarUrl, setAvatarUrl, login, logout };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};