import { createContext, useContext, useEffect, useState } from "react";
import API from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🧠 Auto-login when app reloads
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setUser({ username });
    }
  }, []);

  const login = async (username, password) => {
    const { data } = await API.post("/auth/login", { username, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", username);
    setUser({ username });
  };

  const register = async (username, password) => {
    const { data } = await API.post("/auth/register", { username, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", username);
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
