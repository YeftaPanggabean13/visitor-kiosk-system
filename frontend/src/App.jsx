import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { setAuthToken } from "./services/api";

import Login from "./pages/Login";
import Admin from "./pages/AdminDashboard";
import Security from "./pages/SecurityDashboard";
import Kiosk from "./pages/Kiosk";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Kiosk />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/security" element={<Security />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
