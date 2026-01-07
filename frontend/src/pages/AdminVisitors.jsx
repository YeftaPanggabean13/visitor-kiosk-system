import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import { dashboardUtils } from "../utils/dashboardUtils";

const Th = ({ children }) => (
  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-3 py-2 text-sm text-gray-800">{children}</td>
);

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("id-ID", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "-";

export default function AdminVisitors() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getVisits();
        setVisits(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleExport = () => {
    window.open(adminApi.exportVisits(), "_blank");
  };

  if (loading) return <div>Loading visitor history...</div>;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Visitor History
        </h2>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
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
                  <Td>{v.visitor?.name || "-"}</Td>
                  <Td>{v.visitor?.company || "-"}</Td>
                  <Td>{v.host?.name || "-"}</Td>
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
  );
}
