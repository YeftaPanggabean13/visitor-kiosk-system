import { useEffect, useState } from "react";
import securityApi from "../services/securityApi";

/* ================= Helpers ================= */

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const formatStatus = (status) => {
  if (status === "checked_in") return "Check-in";
  if (status === "checked_out") return "Check-out";
  return "-";
};

const StatusBadge = ({ status }) => {
  const base =
    "inline-flex px-3 py-1 rounded-full text-xs font-semibold";

  const color =
    status === "checked_in"
      ? "bg-green-100 text-green-700"
      : "bg-gray-200 text-gray-700";

  return <span className={`${base} ${color}`}>{formatStatus(status)}</span>;
};

/* ================= Main ================= */

export default function SecurityDashboard() {
  const [visits, setVisits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    const res = await securityApi.getDashboard();
    setVisits(res.data.data.visitors || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ===== Search & Filter ===== */
  useEffect(() => {
    let data = [...visits];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (v) =>
          v.name?.toLowerCase().includes(q) ||
          v.company?.toLowerCase().includes(q) ||
          v.host?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((v) => v.status === statusFilter);
    }

    setFiltered(data);
  }, [search, statusFilter, visits]);

  /* ===== Manual Checkout ===== */
  const handleCheckout = async (id) => {
    if (!confirm("Check out this visitor?")) return;
    await securityApi.checkOutVisit(id);
    fetchDashboard();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Security Dashboard</h1>
        <p className="text-sm text-gray-500">
          Visitor Management System
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search name, company, host..."
          className="px-4 py-2 rounded-lg border w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-lg border w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="checked_in">Checked-in</option>
          <option value="checked_out">Checked-out</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <Th>Name</Th>
              <Th>Company</Th>
              <Th>Host</Th>
              <Th>Status</Th>
              <Th>Check-in</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No data
                </td>
              </tr>
            )}

            {filtered.map((v) => (
              <tr key={v.id} className="border-t">
                <Td>{v.name}</Td>
                <Td>{v.company || "-"}</Td>
                <Td>{v.host || "-"}</Td>
                <Td>
                  <StatusBadge status={v.status} />
                </Td>
                <Td>{formatDate(v.check_in_at)}</Td>
                <Td className="space-x-2">
                  <button
                    onClick={() => setSelectedVisit(v)}
                    className="text-indigo-600 font-semibold"
                  >
                    View
                  </button>

                  {v.status === "checked_in" && (
                    <button
                      onClick={() => handleCheckout(v.id)}
                      className="text-red-600 font-semibold"
                    >
                      Check-out
                    </button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedVisit && (
        <DetailModal
          visit={selectedVisit}
          onClose={() => setSelectedVisit(null)}
        />
      )}
    </div>
  );
}

/* ================= Modal ================= */

const DetailModal = ({ visit, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
      <h2 className="text-xl font-bold">Visitor Detail</h2>

      {visit.photo_url && (
        <img
          src={visit.photo_url}
          alt="Visitor"
          className="w-full h-60 object-cover rounded-lg"
        />
      )}

      <div className="space-y-1 text-sm">
        <p><b>Name:</b> {visit.name}</p>
        <p><b>Company:</b> {visit.company || "-"}</p>
        <p><b>Host:</b> {visit.host || "-"}</p>
        <p><b>Status:</b> {formatStatus(visit.status)}</p>
        <p><b>Check-in:</b> {formatDate(visit.check_in_at)}</p>
        <p><b>Check-out:</b> {formatDate(visit.check_out_at)}</p>
      </div>

      <div className="text-right">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-lg font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

/* ================= UI Atoms ================= */

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left font-semibold text-gray-600">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-4 py-3 text-gray-700">
    {children}
  </td>
);
