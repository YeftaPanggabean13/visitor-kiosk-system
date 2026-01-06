import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MenuItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${
        isActive ? "bg-gray-100 font-semibold" : ""
      }`
    }
  >
    <span className="w-5 h-5" aria-hidden>
      {icon}
    </span>
    <span>{label}</span>
  </NavLink>
);

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r">
       <div className="h-16 flex items-center px-4 font-bold text-lg border-b">
        Visitor Kiosk
      </div>

        <nav className="p-4 space-y-1">
          <MenuItem
            to="/admin/statistics"
            label="Statistics"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                <path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />

          <MenuItem
            to="/admin/visitors"
            label="Visitors"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
                <path d="M6 20v-1c0-2.21 3.58-4 6-4s6 1.79 6 4v1"/>
              </svg>
            }
          />

          <MenuItem
            to="/admin/hosts"
            label="Hosts"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                <path d="M20 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M4 21v-2a4 4 0 0 1 3-3.87"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            }
          />

          <MenuItem
            to="/admin/visitors"
            label="History"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                <path d="M21 10h-6l-2-3H7L5 10H3v8h18v-8z"/>
                <path d="M7 10v-2a2 2 0 1 1 4 0v2"/>
              </svg>
            }
          />
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <span className="text-lg font-semibold">Admin Dashboard</span>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-gray-500">Welcome</span>
              <span className="text-sm font-medium">
                {user?.name || "Admin"}
              </span>
            </div>

            <button
              onClick={() => {
                logout?.();
                navigate("/login");
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
