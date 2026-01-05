import { createContext, useContext, useEffect, useState } from "react";

    export const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setLoading(false);
      }, []);

      const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      };

      const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      };

      return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
          {children}
        </AuthContext.Provider>
      );
    };


    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
      }
      return context;
  };
