import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { setAuthToken } from "./services/api";
import ProtectedRoute from "./routes/ProtectedRoute";

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
          <Route path="/admin/hosts" element={<Admin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
        <Route
        path="/security"
        element={
          <ProtectedRoute role="security">
            <Security />
          </ProtectedRoute>
          } 
        />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
