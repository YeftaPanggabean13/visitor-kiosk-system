import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })
    : "-";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form untuk tambah host
  const [newHost, setNewHost] = useState({
    full_name: "",
    email: "",
    department: "",
  });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  // Fetch dashboard dan hosts
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const resStats = await adminApi.getDashboard();
      setStats(resStats.data.data.stats);

      const resHosts = await adminApi.getHosts();
      setHosts(resHosts.data.data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Tambah host baru
  const handleAddHost = async (e) => {
    e.preventDefault();
    setAddError("");

    if (!newHost.full_name || !newHost.email || !newHost.department) {
      setAddError("Nama, email, dan department wajib diisi");
      return;
    }

    try {
      setAdding(true);
      const res = await adminApi.addHost(newHost);
      setHosts((prev) => [...prev, res.data.data]); // update list host
      setNewHost({ full_name: "", email: "", department: "" });
    } catch (err) {
      console.error(err);
      setAddError(
        err.response?.data?.message || "Gagal menambahkan host"
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Visitors Today" value={stats.visitors_today} />
        <StatCard title="Avg Duration (sec)" value={stats.avg_duration ?? "-"} />
      </div>

      {/* Hosts */}
      <div className="bg-white rounded-xl shadow p-4 mt-6 space-y-4">
        <h2 className="text-lg font-semibold">Host Employees</h2>

        {hosts.length === 0 ? (
          <p>No hosts available</p>
        ) : (
          <ul className="space-y-1">
            {hosts.map((h) => (
              <li key={h.id}>
                {h.full_name} — {h.email} — {h.department}
              </li>
            ))}
          </ul>
        )}

        {/* Form Tambah Host */}
        <form onSubmit={handleAddHost} className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Nama"
            className="border rounded p-2 w-full"
            value={newHost.full_name}
            onChange={(e) => setNewHost({ ...newHost, full_name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded p-2 w-full"
            value={newHost.email}
            onChange={(e) => setNewHost({ ...newHost, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Department"
            className="border rounded p-2 w-full"
            value={newHost.department}
            onChange={(e) => setNewHost({ ...newHost, department: e.target.value })}
          />
          {addError && <p className="text-red-600">{addError}</p>}
          <button
            type="submit"
            disabled={adding}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {adding ? "Menambahkan..." : "Tambah Host"}
          </button>
        </form>
      </div>

      {/* Export Button */}
      <button
        onClick={() => window.open(adminApi.exportVisits(), "_blank")}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl"
      >
        Export Visitor Logs
      </button>
    </div>
  );
}

/* Reusable StatCard */
const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);
