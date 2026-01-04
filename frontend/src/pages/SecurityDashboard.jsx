import React, { useEffect, useState, useRef } from 'react';
import mockApi from '../services/mockApi';

function StatusDot({ status }) {
  const color = status === 'inside' ? 'bg-emerald-500' : 'bg-slate-400';
  return <span className={`inline-block w-3 h-3 rounded-full ${color} mr-2`} />;
}

export default function SecurityDashboard() {
  const [visitors, setVisitors] = useState([]);
  const [hostsMap, setHostsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef(null);

  const fetchHosts = async () => {
    const res = await mockApi.getHosts();
    if (res.success) {
      const map = {};
      res.data.forEach((h) => (map[h.id] = `${h.name} — ${h.department}`));
      setHostsMap(map);
    }
  };

  const fetchVisitors = async () => {
    setLoading(true);
    const res = await mockApi.getCurrentVisitors();
    if (res.success) {
      setVisitors(res.data.sort((a, b) => new Date(b.checkedInAt) - new Date(a.checkedInAt)));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHosts();
    fetchVisitors();

    // Poll for updates every 5 seconds
    pollingRef.current = setInterval(async () => {
      // Small chance to simulate a new check-in
      if (Math.random() < 0.25) {
        await mockApi.postCheckIn({
          fullName: ['Dana Park','Evan Kim','Farah Ali'][Math.floor(Math.random()*3)],
          company: ['Nexus','BlueSky','Quant'][Math.floor(Math.random()*3)],
          phone: '(555) 000-0000',
          hostToVisit: String(Math.floor(Math.random()*5) + 1),
          purposeOfVisit: 'Meeting',
        });
      }
      fetchVisitors();
    }, 5000);

    return () => clearInterval(pollingRef.current);
  }, []);

  const handleCheckOut = async (visitor) => {
    const res = await mockApi.postCheckOut({ checkInId: visitor.checkInId, visitorId: visitor.visitorId });
    if (res.success) {
      // refresh
      fetchVisitors();
    } else {
      // show simple alert for demo
      alert(res.message || 'Failed to check out');
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Security Dashboard</h1>
        <p className="text-slate-600 mb-6">Visitors currently inside the building</p>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Photo</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Company</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Host</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Check-in</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">Loading visitors…</td>
                </tr>
              )}

              {!loading && visitors.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">No visitors currently inside</td>
                </tr>
              )}

              {!loading && visitors.map((v) => (
                <tr key={v.checkInId} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4">
                    {v.photoUrl ? (
                      <img src={v.photoUrl} alt={v.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-500">📷</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">{v.name}</div>
                    <div className="text-xs text-slate-500">{v.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{v.company}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{hostsMap[v.hostToVisit] || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(v.checkedInAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center">
                      <StatusDot status={v.status} />
                      <span className="text-sm text-slate-700">{v.status === 'inside' ? 'Inside' : 'Checked out'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleCheckOut(v)}
                      disabled={v.status !== 'inside'}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm ${v.status === 'inside' ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                      Check-out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
