import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

export default function AdminDashboard() {
  const [visits, setVisits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboard();

      setVisits(res.data.data.visitors || []);
      console.log("Dashboard :", res.data.data.visitors);
      setStats(res.data.data.stats || null);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Visitor Management System
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Visitors Today"
            value={stats.visitors_today}
          />
          <StatCard
            title="Active Visitors"
            value={stats.active_visitors}
          />
          <StatCard
            title="Avg Duration (sec)"
            value={stats.avg_duration ?? "-"}
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <Th>Name</Th>
              <Th>Company</Th>
              <Th>Host</Th>
              <Th>Check-in</Th>
              <Th>Check-out</Th>
            </tr>
          </thead>
          <tbody>
            {visits.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500"
                >
                  No visitor data
                </td>
              </tr>
            )}

            {visits.map((v) => (
              <tr key={v.id || v.visit_id} className="border-t">
                <Td>{v.name|| "-"}</Td>
                <Td>{v.company || "-"}</Td>
                <Td>{v.host || "-"}</Td>
                <Td>{formatDate(v.check_in_at)}</Td>
                <Td>
                  {v.check_out_at ? formatDate(v.check_out_at) : "—"}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===== Reusable Components ===== */

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const Th = ({ children }) => (
  <th className="text-left px-4 py-3 font-semibold text-gray-600">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-4 py-3 text-gray-700">{children}</td>
);
