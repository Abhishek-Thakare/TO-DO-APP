// context/AuthContext.js - Global authentication state
import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true on first load while we check auth

  // On app load, try to fetch the logged-in user's profile
  // If the JWT cookie exists, this will succeed and we know the user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.user);
      } catch (error) {
        setUser(null); // Not logged in
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context easily in any component
export const useAuth = () => useContext(AuthContext);
