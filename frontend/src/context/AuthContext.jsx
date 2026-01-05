import { createContext, useState } from "react";
import { setAuthToken } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    setAuthToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.clear();
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
