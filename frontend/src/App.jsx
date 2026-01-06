import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { setAuthToken } from "./services/api";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminStatistics from "./pages/AdminStatistics";
import AdminHosts from "./pages/AdminHosts";
import AdminVisitors from "./pages/AdminVisitors";
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
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminStatistics />} />
            <Route path="statistics" element={<AdminStatistics />} />
            <Route path="hosts" element={<AdminHosts />} />
            <Route path="visitors" element={<AdminVisitors />} />
          </Route>
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
