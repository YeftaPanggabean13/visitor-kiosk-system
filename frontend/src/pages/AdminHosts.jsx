import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

const Th = ({ children }) => (
  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">{children}</th>
);
const Td = ({ children }) => <td className="px-3 py-2 text-sm text-gray-800">{children}</td>;

export default function AdminHosts() {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHost, setNewHost] = useState({ full_name: "", email: "", department: "" });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getHosts();
        setHosts(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleAddHost = async (e) => {
    e.preventDefault();
    setError("");
    if (!newHost.full_name || !newHost.email || !newHost.department) {
      setError("Nama, email, dan department wajib diisi");
      return;
    }
    try {
      setAdding(true);
      const res = await adminApi.addHost(newHost);
      setHosts((p) => [...p, res.data.data]);
      setNewHost({ full_name: "", email: "", department: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal menambahkan host");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div>Loading hosts...</div>;

  return (
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

      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Add New Host</h3>
        <form onSubmit={handleAddHost} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Full Name"
              className="border border-gray-300 rounded-lg p-2 text-sm"
              value={newHost.full_name}
              onChange={(e) => setNewHost({ ...newHost, full_name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 rounded-lg p-2 text-sm"
              value={newHost.email}
              onChange={(e) => setNewHost({ ...newHost, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Department"
              className="border border-gray-300 rounded-lg p-2 text-sm"
              value={newHost.department}
              onChange={(e) => setNewHost({ ...newHost, department: e.target.value })}
            />
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={adding}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-sm font-medium"
          >
            {adding ? "Adding..." : "Add Host"}
          </button>
        </form>
      </div>
    </div>
  );
}
