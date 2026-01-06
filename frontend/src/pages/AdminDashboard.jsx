import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import {
  VisitorTrendsChart,
  VisitDurationChart,
  VisitStatusChart,
  PeakHoursChart,
  StatCardWithIndicator,
  TopDepartmentsChart,
} from "../components/DashboardCharts";
import { dashboardUtils } from "../utils/dashboardUtils";

/* Utils */
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("id-ID", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "-";

/* Reusable Table Components */
const Th = ({ children }) => (
  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-3 py-2 text-sm text-gray-800">{children}</td>
);

/* Enhanced Stat Card */
const StatCard = ({ title, value, max, color }) => (
  <div className={`rounded-xl shadow p-4 ${
    color === "blue" ? "bg-blue-50" :
    color === "green" ? "bg-green-50" :
    color === "purple" ? "bg-purple-50" :
    "bg-white"
  }`}>
    <p className="text-sm text-gray-600 font-medium">{title}</p>
    <p className={`text-3xl font-bold mt-2 ${
      color === "blue" ? "text-blue-600" :
      color === "green" ? "text-green-600" :
      color === "purple" ? "text-purple-600" :
      "text-gray-800"
    }`}>{value}</p>
    {max && (
      <>
        <p className="text-xs text-gray-500 mt-1">
          {Math.round((value / max) * 100)}% of {max}
        </p>
        <div className="mt-3 bg-gray-300 rounded-full h-2">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              color === "blue" ? "bg-blue-600" :
              color === "green" ? "bg-green-600" :
              color === "purple" ? "bg-purple-600" :
              "bg-gray-600"
            }`}
            style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
          />
        </div>
      </>
    )}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [hosts, setHosts] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Form tambah host */
  const [newHost, setNewHost] = useState({
    full_name: "",
    email: "",
    department: "",
  });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  /* Fetch dashboard data */
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const resStats = await adminApi.getDashboard();
      const resHosts = await adminApi.getHosts();
      const resVisits = await adminApi.getVisits();

      setStats(resStats.data.data.stats);
      setHosts(resHosts.data.data);
      setVisits(resVisits.data.data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* Tambah host */
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
      setHosts((prev) => [...prev, res.data.data]);
      setNewHost({ full_name: "", email: "", department: "" });
    } catch (err) {
      console.error(err);
      setAddError(err.response?.data?.message || "Gagal menambahkan host");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
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
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Visitor and facility management overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Visitors Today"
          value={stats?.visitors_today || 0}
          color="blue"
        />
        <StatCard
          title="Average Visit Duration"
          value={dashboardUtils.formatDuration(stats?.avg_duration || 0)}
          color="green"
        />
        <StatCard
          title="Active Visits"
          value={dashboardUtils.getActiveVisitsCount(visits)}
          max={visits.length || 1}
          color="purple"
        />
        <StatCard
          title="Total Visits"
          value={visits.length}
          color="blue"
        />
      </div>

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitorTrendsChart visits={visits} />
        <VisitStatusChart visits={visits} />
      </div>

      {/* Charts Grid - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitDurationChart visits={visits} />
        <PeakHoursChart visits={visits} />
      </div>

      {/* Top Departments */}
      <TopDepartmentsChart visits={visits} hosts={hosts} />

      {/* Host Management Section */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Host Employees</h2>

        {hosts.length === 0 ? (
          <p className="text-gray-500">No hosts available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Department</Th>
                </tr>
              </thead>
              <tbody>
                {hosts.map((h) => (
                  <tr key={h.id} className="border-t hover:bg-gray-50">
                    <Td>{h.full_name}</Td>
                    <Td>{h.email}</Td>
                    <Td>{h.department}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Host Form */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Add New Host</h3>
          <form onSubmit={handleAddHost} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                value={newHost.full_name}
                onChange={(e) =>
                  setNewHost({ ...newHost, full_name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                value={newHost.email}
                onChange={(e) =>
                  setNewHost({ ...newHost, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Department"
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                value={newHost.department}
                onChange={(e) =>
                  setNewHost({ ...newHost, department: e.target.value })
                }
              />
            </div>

            {addError && (
              <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{addError}</p>
            )}

            <button
              type="submit"
              disabled={adding}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
            >
              {adding ? "Adding..." : "Add Host"}
            </button>
          </form>
        </div>
      </div>

      {/* Visitor History Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Visitor History
          </h2>
          <button
            onClick={() =>
              window.open(adminApi.exportVisits(), "_blank")
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Export (CSV)
          </button>
        </div>

        {visits.length === 0 ? (
          <p className="text-gray-500">No visit records</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <Th>Visitor</Th>
                  <Th>Company</Th>
                  <Th>Host</Th>
                  <Th>Check-in</Th>
                  <Th>Check-out</Th>
                  <Th>Duration</Th>
                </tr>
              </thead>
              <tbody>
                {visits.map((v) => (
                  <tr key={v.id} className="border-t hover:bg-gray-50">
                    <Td>{v.visitor}</Td>
                    <Td>{v.company}</Td>
                    <Td>{v.host}</Td>
                    <Td>{formatDate(v.check_in_at)}</Td>
                    <Td>{formatDate(v.check_out_at)}</Td>
                    <Td>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {dashboardUtils.formatDuration(v.duration) || "-"}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
